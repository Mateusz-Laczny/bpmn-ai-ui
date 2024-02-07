import BpmnEditor from './bpmn-editor';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <main style={{ height: '100%' }}>
      <Container fluid>
        <Row>
          <Col xs={8}>
            <BpmnEditor></BpmnEditor>
          </Col>
          <Col style={{ backgroundColor: 'blue' }}>Chat placeholder</Col>
        </Row>
      </Container>
    </main>
  );
}
