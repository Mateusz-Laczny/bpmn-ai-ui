'use client';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import React, { useEffect, useRef } from 'react';

async function openDiagram(modeler, xml) {
  try {
    await modeler.importXML(xml);

    container.removeClass('with-error').addClass('with-diagram');
  } catch (err) {
    container.removeClass('with-diagram').addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}

export default function ReactEditor() {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef !== null) {
      const container = containerRef.current;
      const bpmnEditor = new BpmnModeler({ container });
      editorRef.current = bpmnEditor;
    }
  }, []);

  useEffect(
    () => () => {
      if (editorRef.current !== null) {
        editorRef.current.destroy();
      }
    },
    [editorRef]
  );

  return <div style={{ position: 'inherit' }} ref={containerRef}></div>;
}
