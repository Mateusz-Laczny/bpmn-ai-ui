import { Stack } from 'react-bootstrap';
import Message from './message';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

function ChatSection() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { user: 'User', text: 'Hello!' },
    { user: 'BPMN Asisstant', text: 'Hello, this is BPMN Assistant!' },
    { user: 'BPMN Asisstant', text: 'How are you today?' },
    { user: 'User', text: "I'm fine, thanks" },
  ]);
  const onInput = ({ target: { value } }) => setNewMessage(value);
  const onKeyPress = ({ key: keyCode }) => {
    if (keyCode !== 'Enter' || newMessage === '') {
      return;
    }

    messages.push({ user: 'User', text: newMessage });
    setMessages(messages);
    setNewMessage('');
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Stack gap={4} className="py-3">
        {messages.map((message, index) => (
          <Message
            user={message.user}
            messageText={message.text}
            key={index}
          ></Message>
        ))}
      </Stack>
      <Form
        style={{
          position: 'absolute',
          display: 'border-box',
          bottom: '16px',
          width: '100%',
        }}
      >
        <InputGroup>
          <InputGroup.Text>Message</InputGroup.Text>
          <Form.Control
            as="textarea"
            aria-label="Message"
            value={newMessage}
            onInput={onInput}
            onKeyDown={onKeyPress}
          />
        </InputGroup>
      </Form>
    </div>
  );
}

export default ChatSection;
