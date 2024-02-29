'use client';

import BpmnViewer from './bpmn-viewer';

function onError(err) {
  console.log('failed to show diagram', err);
}

export default function BpmnEditor({ modelXml }) {
  return (
    <div style={{ height: '100%' }}>
      <BpmnViewer modelXml={modelXml} onError={onError} />
    </div>
  );
}
