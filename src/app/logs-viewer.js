import ListGroup from 'react-bootstrap/ListGroup';
import { Col, Stack, Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';

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

function LogsViever({ logs }) {
  logs.sort((log, anotherLog) => log.index - anotherLog.index);
  return (
    <div
      style={{
        position: 'absolute',
        height: '95%',
        widht: '95%',
        overflowY: 'auto',
        overflowX: 'auto',
      }}
    >
      {logs.map((log, index) => (
        <ListGroup.Item key={index}>{logToComponent(log)}</ListGroup.Item>
      ))}
    </div>
  );
}

export default LogsViever;
