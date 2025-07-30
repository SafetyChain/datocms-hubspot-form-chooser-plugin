import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from 'datocms-react-ui';
import { connect } from 'datocms-plugin-sdk';
import HubSpotFormSelector from './HubSpotFormSelector';
import ConfigScreen from './ConfigScreen';

// Check if we're in an iframe (DatoCMS environment)
const isInIframe = window.parent !== window;

if (isInIframe) {
  // Production mode - connect to DatoCMS
  connect({
    renderConfigScreen(ctx) {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      
      root.render(
        <ConfigScreen ctx={ctx} />
      );
    },
    renderFieldExtension(fieldExtensionId, ctx) {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      
      root.render(
        <Canvas ctx={ctx}>
          <HubSpotFormSelector ctx={ctx} />
        </Canvas>
      );
    }
  });
} else {
  // Development/test mode - render without DatoCMS context
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  // Mock context for testing
  const mockCtx = {
    formValues: {},
    fieldPath: 'test_field',
    setFieldValue: (path, value) => {
      console.log('Setting field value:', path, value);
    },
    startAutoResizer: () => {
      console.log('Auto resizer started (mock)');
    }
  };
  
  root.render(
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>HubSpot Form Selector - Test Mode</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Running outside of DatoCMS iframe. Form selection will be logged to console.
      </p>
      <HubSpotFormSelector ctx={mockCtx} />
    </div>
  );
}