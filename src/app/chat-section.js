import { Stack } from 'react-bootstrap';
import Message from './message';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

function ChatSection() {
  const messages = [
    { user: 'User', text: 'Hello!' },
    { user: 'BPMN Asisstant', text: 'Hello, this is BPMN Assistant!' },
    { user: 'BPMN Asisstant', text: 'How are you today?' },
    { user: 'User', text: "I'm fine, thanks" },
  ];

  return (
    <Stack gap={4} className="py-3">
      {messages.map((message, index) => (
        <Message
          user={message.user}
          messageText={message.text}
          key={index}
        ></Message>
      ))}
      <InputGroup>
        <InputGroup.Text>Message</InputGroup.Text>
        <Form.Control as="textarea" aria-label="Message" />
      </InputGroup>
    </Stack>
  );
}

export default ChatSection;
