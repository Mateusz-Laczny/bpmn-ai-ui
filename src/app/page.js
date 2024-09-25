'use client';

import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import InitialPromptView from './initial-prompt-view';
import MainView from './main-view';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function isBlank(str) {
  return !str || str.trim().length === 0;
}

export default function Home() {
  const [sessionId, setSessionId] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [afterInitialPrompt, setAfterInitialPrompt] = useState(false);
  const [modelXml, setModelXml] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState(
    'An error occured, please try again.'
  );

  const startNewConversation = async (apiKey) => {
    const requestBody = { apiKey: apiKey };
    const response = await fetch(
      'http://localhost:8080/llm2bpmn/sessions/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    return await response.json();
  };

  const onReset = () => {
    startNewConversation(apiKey)
      .then((receivedSessionId) => {
        setSessionId(receivedSessionId);
        setModelXml(undefined);
        setMessages([]);
        setLogs([]);
      })
      .catch((_error) => {
        setErrorToastMessage(
          'Session could not be initialized correctly. Try refreshing the page.'
        );
        setShowErrorToast(true);
      })
      .finally(() => {
        setWaitingForResponse(false);
      });
  };

  const getCompletionForPrompt = async (currentSessionId, requestText) => {
    const addPromptRequestResponse = await fetch(
      `http://localhost:8080/llm2bpmn/sessions/${currentSessionId}/prompts/add`,
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
      `http://localhost:8080/llm2bpmn/sessions/${currentSessionId}/completions/generate`,
      {
        method: 'POST',
      }
    );

    const generationResult = await generateCompletionResponse.json();
    const generationSuccessful =
      generationResult.finishReason.toLowerCase() === 'ok';
    if (!generationSuccessful) {
    }
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

  const onMessageSent = async (currentSessionId, messageText) => {
    const newMessageProperties = { user: 'User', text: messageText };
    const messagesWithUserMessage = [...messages];
    messagesWithUserMessage.push(newMessageProperties);
    setMessages(messagesWithUserMessage);
    const assistantMessage = await getCompletionForPrompt(
      currentSessionId,
      messageText
    );
    return assistantMessage.text;
  };

  const updateMessagesWithNaturalLanguageResponse = (
    completionNaturalLanguageResponse
  ) => {
    console.log(completionNaturalLanguageResponse);
    if (completionNaturalLanguageResponse) {
      console.log('test');
      const requestsWithNaturalLanguageResponse = [...messagesWithUserMessage];
      requestsWithNaturalLanguageResponse.push(
        completionNaturalLanguageResponse
      );
      setMessages(requestsWithNaturalLanguageResponse);
    }
  };

  const onInitialInfoProvided = (initialInfo) => {
    setAfterInitialPrompt(true);
    setWaitingForResponse(true);
    setShowErrorToast(false);
    const providedApiKey = initialInfo.apiKey;
    setApiKey(providedApiKey);
    startNewConversation(providedApiKey)
      .then((receivedSessionId) => {
        setSessionId(receivedSessionId.sessionId);
        return onMessageSent(
          receivedSessionId.sessionId,
          initialInfo.description
        );
      })
      .then(updateMessagesWithNaturalLanguageResponse)
      .catch((_error) => {
        setErrorToastMessage(
          'Session could not be initialized correctly. Try refreshing the page.'
        );
        setShowErrorToast(true);
        setAfterInitialPrompt(false);
      })
      .finally(() => {
        setWaitingForResponse(false);
      });
  };

  return (
    <main style={{ height: '100%' }}>
      {modelXml ? (
        <Container fluid style={{ height: '100%' }} className="py-4">
          <MainView
            modelXml={modelXml}
            messages={messages}
            logs={logs}
            onMessageSent={(requestText) => {
              onMessageSent(sessionId, requestText)
                .then(updateMessagesWithNaturalLanguageResponse)
                .catch((_e) => {
                  setErrorToastMessage(
                    'Generation process failed. Please try again..'
                  );
                  setShowErrorToast(true);
                })
                .finally(() => {
                  setWaitingForResponse(false);
                });
            }}
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
                onInitialInfo={onInitialInfoProvided}
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
                {errorToastMessage}
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Container>
      )}
    </main>
  );
}
