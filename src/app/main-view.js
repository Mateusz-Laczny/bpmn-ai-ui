import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BpmnEditor from './bpmn-editor';
import ChatAndLogsWorkspace from './chat-and-logs-workspace';

export default function MainView({ modelXml, messages, logs, onMessageSent }) {
  return (
    <Row style={{ height: '100%' }}>
      <Col xs={8} className="position-relative">
        <BpmnEditor modelXml={modelXml}></BpmnEditor>
      </Col>
      <Col
        className="border border-3 rounded mx-3 my-3"
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
