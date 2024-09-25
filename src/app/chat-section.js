import { Stack, Button } from 'react-bootstrap';
import Message from './message';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

function ChatSection({ messages, onMessageSent: onNewRequestSubmitted }) {
  const [newRequestText, setNewRequestText] = useState('');

  const onInput = ({ target: { value } }) => setNewRequestText(value);

  const onMessageSent = () => {
    onNewRequestSubmitted(newRequestText);
    setNewRequestText('');
  };

  const onKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (newRequestText.trim() !== '') {
        onMessageSent();
      }
    }
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
            value={newRequestText}
            onInput={onInput}
            onKeyDown={onKeyPress}
            className="me-auto"
            style={{ resize: 'none' }}
          />
          <Button onClick={() => onMessageSent()}>Send</Button>
        </Stack>
      </Form>
    </div>
  );
}

export default ChatSection;
