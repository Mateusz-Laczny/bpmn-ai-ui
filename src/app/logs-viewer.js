import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Stack, Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

function logToComponent(log) {
  return (
    <Stack direction="horizontal" gap={2}>
      {log.parts.map((part, index) => {
        if (part.type == 'text') {
          return <div key={index}>{part.text}</div>;
        } else {
          return <Badge key={index}>{part.text}</Badge>;
        }
      })}
    </Stack>
  );
}

function propertiesToTable(properties) {
  properties.sort(
    (property, anotherProperty) => property.index - anotherProperty.index
  );

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Property name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((property, index) => (
          <tr key={index}>
            <td>{property.name}</td>
            <td>{property.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function LogsViever({ logs }) {
  logs.sort((log, anotherLog) => log.index - anotherLog.index);
  return (
    <Accordion
      style={{
        position: 'absolute',
        width: '97%',
        height: '93%',
        overflowY: 'auto',
      }}
    >
      {logs.map((log, index) => (
        <Accordion.Item eventKey={index} key={index}>
          <Accordion.Header>{log.header}</Accordion.Header>
          <Accordion.Body>{propertiesToTable(log.properties)}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default LogsViever;
