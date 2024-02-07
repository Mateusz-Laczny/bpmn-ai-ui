'use client';

import BpmnEditor from './bpmn-editor';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatSection from './chat-section';

export default function Home() {
  return (
    <main className="my-3">
      <Container fluid>
        <Row>
          <Col xs={8}>
            <BpmnEditor></BpmnEditor>
          </Col>
          <Col style={{ backgroundColor: 'blue' }}>
            <ChatSection></ChatSection>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
