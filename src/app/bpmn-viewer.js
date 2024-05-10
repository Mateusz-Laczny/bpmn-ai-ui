import React, { useEffect, useRef } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

export default function BpmnViewer({ modelXml }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    editorRef.current = new BpmnModeler({ container });
    editorRef.current.on('import.done', (event) => {
      const { error, warnings } = event;

      if (error) {
        console.log(error);
      }

      editorRef.current.get('canvas').zoom('fit-viewport');
      console.log(warnings);
    });

    return () => {
      editorRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (modelXml && editorRef.current) {
      editorRef.current.importXML(modelXml);
    }
  }, [modelXml]);

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
}
