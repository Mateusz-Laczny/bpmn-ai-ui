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
        parts: [
          { type: 'text', text: `Node` },
          { type: 'value', text: log.nodeId.name },
          { type: 'text', text: `with id` },
          { type: 'value', text: log.nodeId.id },
          { type: 'text', text: `${action} to diagram` },
        ],
      };
    });
    updatedLogs.push(...nodeModificationLogs);

    const flowModificationLogs = data.flowModificationLogs.map((log) => {
      const action =
        log.modificationType.toLowerCase() === 'add' ? 'added' : 'removed';
      return {
        index: log.index,
        parts: [
          { type: 'text', text: `Flow ${action} between node` },
          { type: 'value', text: log.sourceId.name },
          { type: 'text', text: `with id` },
          { type: 'value', text: log.sourceId.id },
          { type: 'text', text: `and node` },
          { type: 'value', text: log.targetId.name },
          { type: 'text', text: `with id` },
          { type: 'value', text: log.targetId.id },
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
