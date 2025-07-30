import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from 'datocms-react-ui';
import { connectToParent } from 'datocms-plugin-sdk';
import HubSpotFormSelector from './HubSpotFormSelector';

connectToParent({
  renderFieldExtension(fieldExtensionId, ctx) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    
    root.render(
      <Canvas ctx={ctx}>
        <HubSpotFormSelector ctx={ctx} />
      </Canvas>
    );
  }
});