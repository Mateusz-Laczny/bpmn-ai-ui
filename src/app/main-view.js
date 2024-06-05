import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChatAndLogsWorkspace from './chat-and-logs-workspace';
import { Stack, Button, Container } from 'react-bootstrap';
import BpmnViewer from './bpmn-viewer';
import { useRef, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function MainView({
  modelXml,
  messages,
  logs,
  onMessageSent,
  onReset,
  waitingForResponse,
}) {
  const vieverRef = useRef();

  const onDownload = () => {
    vieverRef.current.downloadModel();
  };

  return (
    <Row style={{ height: '100%' }}>
      <Col xs={8} className="position-relative ms-3">
        <Container fluid className="p-0" style={{ height: '100%' }}>
          <Row className="border border-3 rounded" style={{ height: '95%' }}>
            {waitingForResponse ? (
              <div
                className="position-absolute top-50 start-50 translate-middle p-4"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <h2>Processing request...</h2>
                <div className="mt-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Generating model</span>
                  </Spinner>
                </div>
              </div>
            ) : (
              <div>
                <BpmnViewer modelXml={modelXml} ref={vieverRef}></BpmnViewer>
              </div>
            )}
          </Row>
          <Row
            className="mt-2 border border-3 rounded"
            style={{ height: '5%' }}
          >
            <Stack direction="horizontal" gap={3}>
              <Button onClick={onDownload}>Download</Button>
              <Button variant="danger" onClick={onReset}>
                Reset
              </Button>
            </Stack>
          </Row>
        </Container>
      </Col>
      <Col
        className="border border-3 rounded mx-3"
        style={{ position: 'relative' }}
      >
        <ChatAndLogsWorkspace
          messages={messages}
          logs={logs}
          onMessageSent={onMessageSent}
        ></ChatAndLogsWorkspace>
      </Col>
    </Row>
  );
}
