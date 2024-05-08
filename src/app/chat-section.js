import { Col, Stack, Button } from 'react-bootstrap';
import Message from './message';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';

function ChatSection({ messages, onMessageSent, onReset }) {
  const [newMessage, setNewMessage] = useState('');

  const onInput = ({ target: { value } }) => setNewMessage(value);
  const onKeyPress = ({ key: keyCode }) => {
    if (keyCode !== 'Enter' || newMessage === '') {
      return;
    }

    onMessageSent(newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <Stack
        gap={4}
        style={{
          position: 'absolute',
          width: '95%',
          height: '80%',
          overflowY: 'auto',
        }}
      >
        {messages.map((message, index) => (
          <Message
            user={message.user}
            messageText={message.text}
            key={index}
          ></Message>
        ))}
      </Stack>
      <Form
        className="mt-2"
        style={{ position: 'absolute', bottom: '16px', width: '95%' }}
      >
        <Stack direction="horizontal" gap={3}>
          <Form.Control
            as="textarea"
            aria-label="Message"
            value={newMessage}
            onInput={onInput}
            onKeyDown={onKeyPress}
            className="me-auto"
          />
          <Button variant="danger" onClick={onReset}>
            Reset
          </Button>
        </Stack>
      </Form>
    </div>
  );
}

export default ChatSection;
