import React, { useState } from 'react';
import { Canvas, Button, TextField } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css';

function ConfigScreen({ ctx }) {
  const [apiKey, setApiKey] = useState(ctx.plugin.attributes.parameters.hubspotApiKey || '');
  const [filterArchived, setFilterArchived] = useState(ctx.plugin.attributes.parameters.filterArchived !== false);
  const [showDates, setShowDates] = useState(ctx.plugin.attributes.parameters.showDates !== false);
  const [cacheHours, setCacheHours] = useState(ctx.plugin.attributes.parameters.cacheHours || 24);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ctx.updatePluginParameters({
        hubspotApiKey: apiKey,
        filterArchived: filterArchived,
        showDates: showDates,
        cacheHours: cacheHours
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
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'uppercase',
          color: '#333',
          margin: '0 0 20px 0',
          letterSpacing: '0.5px'
        }}>
          SafetyChain HubSpot Form Search Plugin
        </h2>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <img 
            src="images/safetychain-logo.svg" 
            alt="SafetyChain" 
            style={{ height: '40px' }}
          />
          <span style={{ fontSize: '20px', color: '#64748b' }}>+</span>
          <img 
            src="images/hupsot-logo.svg" 
            alt="HubSpot" 
            style={{ height: '40px' }}
          />
        </div>
        
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

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            <input
              type="checkbox"
              checked={filterArchived}
              onChange={(e) => setFilterArchived(e.target.checked)}
              style={{
                marginRight: '10px',
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#0ea5e9'
              }}
            />
            <div>
              <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                Filter out archived forms
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Hide forms with [archived] or [archive] in their name
              </div>
            </div>
          </label>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            <input
              type="checkbox"
              checked={showDates}
              onChange={(e) => setShowDates(e.target.checked)}
              style={{
                marginRight: '10px',
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#0ea5e9'
              }}
            />
            <div>
              <div style={{ fontWeight: '500', color: '#1a1a1a' }}>
                Show creation dates
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Display form creation dates in the dropdown
              </div>
            </div>
          </label>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <TextField
            id="cacheHours"
            name="cacheHours"
            label="Cache Duration (hours)"
            value={cacheHours}
            onChange={(value) => setCacheHours(parseInt(value) || 24)}
            hint="How long to cache form data before refreshing from HubSpot (default: 24 hours)"
            placeholder="24"
            textInputProps={{
              type: 'number',
              min: '1',
              max: '168' // 1 week max
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
            color: '#333'
          }}>
            🔑 How to get your HubSpot API key
          </h4>
          
          <ol style={{ 
            margin: 0,
            paddingLeft: '20px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#64748b'
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
                fontSize: '13px'
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
            fontSize: '14px',
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