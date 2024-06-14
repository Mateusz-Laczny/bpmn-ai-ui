'use client';

import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import InitialPromptView from './initial-prompt-view';
import MainView from './main-view';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function isBlank(str) {
  return !str || str.trim().length === 0;
}

export default function Home() {
  const [sessionId, setSessionId] = useState(undefined);
  const [afterInitialPrompt, setAfterInitialPrompt] = useState(false);
  const [modelXml, setModelXml] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const startNewConversation = () => {
    fetch('http://localhost:8080/llm2bpmn/sessions/create', { method: 'POST' })
      .then((response) => {
        setModelXml(undefined);
        setMessages([]);
        setLogs([]);
        return response.json();
      })
      .then((responseBody) => {
        setSessionId(responseBody.sessionId);
        setWaitingForResponse(false);
      })
      .catch(() => {
        setShowErrorToast(true);
        setAfterInitialPrompt(false);
      });
  };

  useEffect(() => {
    startNewConversation();
  }, []);

  const fetchResponse = async (requestText) => {
    const addPromptRequestResponse = await fetch(
      `http://localhost:8080/llm2bpmn/sessions/${sessionId}/prompts/add`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: requestText }),
      }
    );

    if (!addPromptRequestResponse.ok) {
      throw new Error(`HTTP error! status: ${addPromptRequestResponse.status}`);
    }

    const generateCompletionResponse = await fetch(
      `http://localhost:8080/llm2bpmn/sessions/${sessionId}/completions/generate`,
      {
        method: 'POST',
      }
    );

    const generationResult = await generateCompletionResponse.json();
    setModelXml(generationResult.bpmnXml);

    const updatedLogs = [...logs];
    const nodeModificationLogs = generationResult.nodeModificationLogs.map(
      (log) => {
        const action =
          log.modificationType.toLowerCase() === 'add' ? 'added' : 'removed';
        return {
          index: log.index,
          header: `${action.toUpperCase()} node ${log.nodeId.name}`,
          properties: [
            { index: 0, name: 'ID', value: log.nodeId.id },
            { index: 1, name: 'Name', value: log.nodeId.name },
            { index: 2, name: 'Element Type', value: log.elementType },
          ],
        };
      }
    );

    updatedLogs.push(...nodeModificationLogs);

    const flowModificationLogs = generationResult.flowModificationLogs.map(
      (log) => {
        const action =
          log.modificationType.toLowerCase() === 'add' ? 'added' : 'removed';
        return {
          index: log.index,
          header: `${action.toUpperCase()} sequence flow between ${
            log.sourceId.name
          } and ${log.targetId.name}`,
          properties: [
            { index: 0, name: 'Source ID', value: log.sourceId.id },
            { index: 1, name: 'Source Name', value: log.sourceId.name },
            { index: 2, name: 'Target ID', value: log.targetId.id },
            { index: 3, name: 'Target Name', value: log.targetId.name },
          ],
        };
      }
    );
    updatedLogs.push(...flowModificationLogs);
    setLogs(updatedLogs);

    return {
      user: 'Assistant',
      text: generationResult.responseContent,
    };
  };

  const onMessageSent = (messageText) => {
    const newMessageProperties = { user: 'User', text: messageText };
    const messagesWithUserMessage = [...messages];
    messagesWithUserMessage.push(newMessageProperties);
    setMessages(messagesWithUserMessage);
    setWaitingForResponse(true);
    fetchResponse(newMessageProperties.text)
      .then((assistantMessage) => {
        if (!isBlank(assistantMessage.text)) {
          const messagesWithAssistantResponse = [...messagesWithUserMessage];
          messagesWithAssistantResponse.push(assistantMessage);
          setMessages(messagesWithAssistantResponse);
        }
        setWaitingForResponse(false);
      })
      .catch(() => {
        setShowErrorToast(true);
        setAfterInitialPrompt(false);
      });
  };

  const onReset = () => {
    startNewConversation();
    setAfterInitialPrompt(false);
  };

  const onInitialPromptProvided = (initialPrompt) => {
    setAfterInitialPrompt(true);
    startNewConversation();
    onMessageSent(initialPrompt);
  };

  return (
    <main style={{ height: '100%' }}>
      {modelXml ? (
        <Container fluid style={{ height: '100%' }} className="py-4">
          <MainView
            modelXml={modelXml}
            messages={messages}
            logs={logs}
            onMessageSent={onMessageSent}
            onReset={onReset}
            waitingForResponse={waitingForResponse}
          ></MainView>
        </Container>
      ) : (
        <Container
          className="position-relative m-0 p-0"
          fluid
          style={{ height: '100%' }}
        >
          {afterInitialPrompt ? (
            <div className="position-absolute top-50 start-50 translate-middle p-4 border border-3 rounded">
              <h4>Please wait while the model is being generated...</h4>
              <div className="mt-3" style={{ display: 'flex' }}>
                <Spinner
                  animation="border"
                  role="status"
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <span className="visually-hidden">Generating model</span>
                </Spinner>
              </div>
            </div>
          ) : (
            <div className="position-absolute top-50 start-50 translate-middle p-4 border border-3 rounded">
              <InitialPromptView
                onInitialPromptProvided={onInitialPromptProvided}
              ></InitialPromptView>
            </div>
          )}
          <ToastContainer
            position="bottom-end"
            className="p-3"
            style={{ zIndex: 1 }}
          >
            <Toast
              bg="danger"
              onClose={() => setShowErrorToast(false)}
              show={showErrorToast}
              delay={5000}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Error</strong>
              </Toast.Header>
              <Toast.Body className="text-white">
                Could not generate the model. Please try again.
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Container>
      )}
    </main>
  );
}
