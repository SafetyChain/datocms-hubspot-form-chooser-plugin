import React, { useState } from 'react';
import { Canvas, Button, Form, FieldGroup, TextField } from 'datocms-react-ui';

function ConfigScreen({ ctx }) {
  const [apiKey, setApiKey] = useState(ctx.plugin.attributes.parameters.hubspotApiKey || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ctx.updatePluginParameters({
        hubspotApiKey: apiKey
      });
      ctx.notice('Settings saved successfully!');
    } catch (error) {
      ctx.alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Canvas ctx={ctx}>
      <div style={{ padding: '20px' }}>
        <h2>HubSpot Form Selector Configuration</h2>
        
        <Form>
          <FieldGroup>
            <TextField
              id="apiKey"
              name="apiKey"
              label="HubSpot Private App Token"
              value={apiKey}
              onChange={setApiKey}
              hint="Your HubSpot private app access token with 'forms' read scope"
              placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              required
            />
          </FieldGroup>
          
          <Button
            onClick={handleSave}
            disabled={!apiKey || saving}
            buttonType="primary"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Form>

        <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
          <h3>How to get your HubSpot API key:</h3>
          <ol>
            <li>Log into HubSpot</li>
            <li>Go to Settings → Integrations → Private Apps</li>
            <li>Create a new private app with 'forms' read scope</li>
            <li>Copy the access token and paste it above</li>
          </ol>
        </div>
      </div>
    </Canvas>
  );
}

export default ConfigScreen;