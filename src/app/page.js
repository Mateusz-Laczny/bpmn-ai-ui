'use client';

import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import InitialPromptView from './initial-prompt-view';
import MainView from './main-view';
import Spinner from 'react-bootstrap/Spinner';

export default function Home() {
  const [afterInitialPrompt, setAfterInitialPrompt] = useState(false);
  const [modelXml, setModelXml] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);

  const startNewConversation = () => {
    fetch('http://localhost:8080/generate/v2/start', { method: 'POST' }).then(
      (_response) => {
        setModelXml(undefined);
        setMessages([]);
        setLogs([]);
      }
    );
  };

  const fetchResponse = async (requestText) => {
    const response = await fetch(
      'http://localhost:8080/generate/v2/send/message',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: requestText }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    setModelXml(data.bpmnXml);

    const updatedLogs = [...logs];
    const nodeModificationLogs = data.nodeModificationLogs.map((log) => {
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
    });
    updatedLogs.push(...nodeModificationLogs);

    const flowModificationLogs = data.flowModificationLogs.map((log) => {
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
    });
    updatedLogs.push(...flowModificationLogs);
    setLogs(updatedLogs);

    return {
      user: 'Assistant',
      text: data.responseContent,
    };
  };

  const onMessageSent = (messageText) => {
    const newMessageProperties = { user: 'User', text: messageText };
    const messagesWithUserMessage = [...messages];
    messagesWithUserMessage.push(newMessageProperties);
    setMessages(messagesWithUserMessage);
    fetchResponse(newMessageProperties.text).then((assistantMessage) => {
      const messagesWithAssistantResponse = [...messagesWithUserMessage];
      messagesWithAssistantResponse.push(assistantMessage);
      setMessages(messagesWithAssistantResponse);
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
                  <span className="visually-hidden">Generating model...</span>
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
        </Container>
      )}
    </main>
  );
}
