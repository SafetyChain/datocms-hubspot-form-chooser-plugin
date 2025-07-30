import React, { useState } from 'react';
import { Canvas, Button, TextField } from 'datocms-react-ui';

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
      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '32px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#0f172a',
          margin: '0 0 8px 0'
        }}>
          Plugin Configuration
        </h2>
        
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: '0 0 32px 0',
          lineHeight: '1.5'
        }}>
          Connect your HubSpot account to enable form selection in DatoCMS.
        </p>

        <div style={{ marginTop: '32px', marginBottom: '24px' }}>
          <TextField
            id="apiKey"
            name="apiKey"
            label="HubSpot Private App Token"
            value={apiKey}
            onChange={setApiKey}
            hint="Enter your HubSpot private app access token with 'forms' read scope"
            placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
            textInputProps={{
              monospaced: true
            }}
          />
        </div>
        
        <Button
          onClick={handleSave}
          disabled={!apiKey || saving}
          buttonType="primary"
          fullWidth={false}
        >
          {saving ? 'Saving...' : 'Save configuration'}
        </Button>

        <div style={{ 
          marginTop: '48px',
          padding: '24px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e3e5e8'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            🔑 How to get your HubSpot API key
          </h4>
          
          <ol style={{ 
            margin: 0,
            paddingLeft: '20px',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#4a5568'
          }}>
            <li style={{ marginBottom: '8px' }}>
              Log into your HubSpot account
            </li>
            <li style={{ marginBottom: '8px' }}>
              Navigate to <strong>Settings → Integrations → Private Apps</strong>
            </li>
            <li style={{ marginBottom: '8px' }}>
              Create a new private app with <code style={{
                backgroundColor: '#edf2f7',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '12px'
              }}>forms</code> read scope
            </li>
            <li>
              Copy the access token and paste it in the field above
            </li>
          </ol>
        </div>

        {apiKey && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#166534'
          }}>
            ✅ API key is configured. Your plugin is ready to use!
          </div>
        )}
      </div>
    </Canvas>
  );
}

export default ConfigScreen;