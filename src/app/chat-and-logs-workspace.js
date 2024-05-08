import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ChatSection from './chat-section';
import LogsViever from './logs-viewer';
import { useState, useEffect } from 'react';

function ChatAndLogsWorkspace({ onModelUpdate }) {
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);

  const startNewConversation = () => {
    fetch('http://localhost:8080/generate/v2/start', { method: 'POST' }).then(
      (_response) => {
        setMessages([]);
        setLogs([]);
      }
    );
  };

  useEffect(() => {
    startNewConversation();
  }, []);

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
    onModelUpdate(data.bpmnXml);

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
  };

  return (
    <Tabs defaultActiveKey="chat" id="chat-and-logs" className="mb-3 mt-2">
      <Tab eventKey="chat" title="Chat" style={{ height: '100%' }}>
        <ChatSection
          messages={messages}
          onMessageSent={onMessageSent}
          onReset={onReset}
        ></ChatSection>
      </Tab>
      <Tab eventKey="logs" title="Generation logs" style={{ height: '100%' }}>
        <LogsViever logs={logs}></LogsViever>
      </Tab>
    </Tabs>
  );
}

export default ChatAndLogsWorkspace;
