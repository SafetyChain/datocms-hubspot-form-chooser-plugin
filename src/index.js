import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from 'datocms-react-ui';
import { connect } from 'datocms-plugin-sdk';
import HubSpotFormSelector from './HubSpotFormSelector';

connect({
  renderFieldExtension(fieldExtensionId, ctx) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    
    root.render(
      <Canvas ctx={ctx}>
        <HubSpotFormSelector ctx={ctx} />
      </Canvas>
    );
  }
});