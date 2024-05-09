'use client';

import BpmnEditor from './bpmn-editor';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatSection from './chat-section';
import { useState } from 'react';
import ChatAndLogsWorkspace from './chat-and-logs-workspace';
import InitialPromptView from './initial-prompt-view';

export default function Home() {
  const [modelXml, setModelXml] = useState(undefined);
  const [afterInitialPrompt, setAfterInitialPrompt] = useState(false);

  const onModelUpdate = (updatedModelXml) => {
    setModelXml(updatedModelXml);
  };

  const onInitialPromptProvided = () => {
    setAfterInitialPrompt(true);
  };

  return (
    <main style={{ height: '100%' }}>
      {afterInitialPrompt ? (
        <Container fluid style={{ height: '100%' }}>
          <Row style={{ height: '100%' }}>
            <Col xs={8} className="position-relative">
              {modelXml ? (
                <BpmnEditor modelXml={modelXml}></BpmnEditor>
              ) : (
                <div style={{ height: '100%', alignContent: 'center' }}>
                  <h2 className="position-absolute top-50 start-50 translate-middle">
                    Tip: Send a message to the Assistant, to start creating the
                    model!
                  </h2>
                </div>
              )}
            </Col>
            <Col
              className="border border-dark-subtle rounded-3 mx-3 my-3"
              style={{ backgroundColor: 'black', position: 'relative' }}
            >
              <ChatAndLogsWorkspace
                onModelUpdate={onModelUpdate}
              ></ChatAndLogsWorkspace>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container
          className="position-relative gray-600"
          style={{ height: '100%' }}
        >
          <div className="position-absolute top-50 start-50 translate-middle p-4 border border-3 rounded">
            <InitialPromptView
              onInitialPromptProvided={onInitialPromptProvided}
            ></InitialPromptView>
          </div>
        </Container>
      )}
    </main>
  );
}
