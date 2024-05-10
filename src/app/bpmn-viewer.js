import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

const BpmnViewer = forwardRef(({ modelXml }, ref) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  const downloadModel = () => {
    console.log('Downloading');
    if (!editorRef.current) {
      return;
    }

    editorRef.current.saveXML({ format: true }).then(({ xml }) => {
      const blob = new Blob([xml], { type: 'application/xml' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'model.bpmn';
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
    });
  };

  useImperativeHandle(ref, () => ({
    downloadModel: downloadModel,
  }));

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
      editorRef.current.importXML(modelXml).catch((error) => {
        if (error.constructor === SyntaxError) {
          // Strange error, but does not seem to break anything
          return;
        }

        console.error(error.message);
      });
      editorRef.current.get('canvas').zoom('fit-viewport');
    }
  }, [modelXml]);

  return <div style={{ height: '100%' }} ref={containerRef}></div>;
});

BpmnViewer.displayName = 'BpmnViewer';

export default BpmnViewer;
