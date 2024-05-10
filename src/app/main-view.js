import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChatAndLogsWorkspace from './chat-and-logs-workspace';
import { Stack, Button, Container } from 'react-bootstrap';
import BpmnViewer from './bpmn-viewer';
import { useRef } from 'react';

export default function MainView({
  modelXml,
  messages,
  logs,
  onMessageSent,
  onReset,
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
            <div>
              <BpmnViewer modelXml={modelXml} ref={vieverRef}></BpmnViewer>
            </div>
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
