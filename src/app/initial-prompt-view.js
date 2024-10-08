import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Stack, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

export default function InitialPromptView({ onInitialInfo }) {
  const [apiKey, setApiKey] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [validated, setValidated] = useState(false);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handlePromptDescriptionChange = (e) => {
    setInitialPrompt(e.target.value);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      onInitialInfo({
        apiKey: apiKey,
        description: initialPrompt,
      });
    }

    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group controlId="process-description-input" className="mb-3">
        <Form.Label as="h2" className="mb-3">
          Provide the process description to be used to generate the diagram.
        </Form.Label>
        <div>
          This description will be used to generate the initial draft of the
          BPMN model. Try to describe the process as accurately as possible.
        </div>
        <Form.Label as="h5" className="mt-4">
          OpenAI API key
        </Form.Label>
        <Form.Control
          value={apiKey}
          onChange={handleApiKeyChange}
          required
          placeholder="OpenAI API Key"
          type="text"
          className="mt-2"
        />
        <Form.Control.Feedback type="invalid">
          Please provide an API key
        </Form.Control.Feedback>
        <Form.Label as="h5" className="mt-3">
          Process description
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          value={initialPrompt}
          onChange={handlePromptDescriptionChange}
          required
          placeholder="Proces description goes here"
          type="text"
          className="mt-2"
        />
        <Form.Control.Feedback type="invalid">
          Please provide a description
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
