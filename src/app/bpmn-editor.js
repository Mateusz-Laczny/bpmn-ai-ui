'use client';

import ReactBpmn from 'react-bpmn';

import React, { useEffect, useRef } from 'react';

async function openDiagram(modeler, xml) {
  try {
    await modeler.importXML('');

    container.removeClass('with-error').addClass('with-diagram');
  } catch (err) {
    container.removeClass('with-diagram').addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}

export default function ReactEditor() {
  return (
    <div style={{ height: '100%' }}>
      <ReactBpmn url="https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/url-viewer/resources/pizza-collaboration.bpmn" />
    </div>
  );
}
