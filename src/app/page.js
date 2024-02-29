'use client';

import BpmnEditor from './bpmn-editor';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatSection from './chat-section';
import { useState } from 'react';

export default function Home() {
  const [modelXml, setModelXml] = useState(undefined);
  const onModelUpdate = (updatedModelXml) => {
    setModelXml(updatedModelXml);
  };

  return (
    <main style={{ height: '100%' }}>
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
          <Col className="bg-primary-subtle border border-dark-subtle rounded-3 mx-3 my-3">
            <ChatSection onModelUpdate={onModelUpdate}></ChatSection>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
