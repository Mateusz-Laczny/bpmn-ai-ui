'use client';

import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef } from 'react';
import InitialPromptView from './initial-prompt-view';
import MainView from './main-view';
import Overlay from 'react-bootstrap/Overlay';
import Spinner from 'react-bootstrap/Spinner';
import { Stack } from 'react-bootstrap';

export default function Home() {
  const [afterInitialPrompt, setAfterInitialPrompt] = useState(false);
  const [
    afterModelGeneratedForInitialPrompt,
    setAfterModelGeneratedForInitialPrompt,
  ] = useState(false);

  const onModelGeneratedForInitialPrompt = () => {
    setAfterModelGeneratedForInitialPrompt(true);
  };

  const onInitialPromptProvided = () => {
    setAfterInitialPrompt(true);
  };

  return (
    <main style={{ height: '100%' }}>
      {afterModelGeneratedForInitialPrompt ? (
        <Container fluid style={{ height: '100%' }}>
          <MainView></MainView>
        </Container>
      ) : (
        <Container
          className="position-relative m-0 p-0"
          fluid
          style={{ height: '100%' }}
        >
          {afterInitialPrompt ? (
            <div className="position-absolute top-50 start-50 translate-middle p-4 border border-3 rounded">
              <h4>Please wait while the model is being generated...</h4>
              <div className="mt-3" style={{ display: 'flex' }}>
                <Spinner
                  animation="border"
                  role="status"
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <span className="visually-hidden">Generating model...</span>
                </Spinner>
              </div>
            </div>
          ) : (
            <div className="position-absolute top-50 start-50 translate-middle p-4 border border-3 rounded">
              <InitialPromptView
                onInitialPromptProvided={onInitialPromptProvided}
              ></InitialPromptView>
            </div>
          )}
        </Container>
      )}
    </main>
  );
}
