import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ChatSection from './chat-section';
import LogsViever from './logs-viewer';
import { useState, useEffect } from 'react';

function ChatAndLogsWorkspace({ messages, logs, onMessageSent }) {
  return (
    <Tabs defaultActiveKey="chat" id="chat-and-logs" className="mb-3 mt-2">
      <Tab eventKey="chat" title="Chat" style={{ height: '100%' }}>
        <ChatSection
          messages={messages}
          onMessageSent={onMessageSent}
        ></ChatSection>
      </Tab>
      <Tab eventKey="logs" title="Generation logs" style={{ height: '100%' }}>
        <LogsViever logs={logs}></LogsViever>
      </Tab>
    </Tabs>
  );
}

export default ChatAndLogsWorkspace;
