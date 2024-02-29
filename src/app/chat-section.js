import { Stack } from 'react-bootstrap';
import Message from './message';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

function ChatSection({ onModelUpdate }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchResponse = async (requestText) => {
    const response = await fetch(
      'http://localhost:8080/generate/v2/send/message',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: requestText }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    onModelUpdate(data.bpmnXml);
    return {
      user: 'Assistant',
      text: data.responseContent,
    };
  };

  const onInput = ({ target: { value } }) => setNewMessage(value);
  const onKeyPress = ({ key: keyCode }) => {
    if (keyCode !== 'Enter' || newMessage === '') {
      return;
    }

    const newMessageProperties = { user: 'User', text: newMessage };
    const messagesWithUserMessage = [...messages];
    messagesWithUserMessage.push(newMessageProperties);
    setMessages(messagesWithUserMessage);
    setNewMessage('');
    fetchResponse(newMessageProperties.text).then((assistantMessage) => {
      const messagesWithAssistantResponse = [...messagesWithUserMessage];
      messagesWithAssistantResponse.push(assistantMessage);
      setMessages(messagesWithAssistantResponse);
    });
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Stack gap={4}>
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
