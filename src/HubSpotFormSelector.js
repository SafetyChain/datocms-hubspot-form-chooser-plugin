import React, { useState, useEffect, useMemo } from 'react';
import { Button, TextInput, SelectField, Spinner } from 'datocms-react-ui';

const API_ENDPOINT = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/hubspot-forms'
  : '/api/hubspot-forms';

function HubSpotFormSelector({ ctx }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Safely get the initial value
  const initialValue = ctx.fieldPath && ctx.formValues ? ctx.formValues[ctx.fieldPath] : '';
  const [selectedForm, setSelectedForm] = useState(initialValue || '');

  // Start auto-resizer
  useEffect(() => {
    ctx.startAutoResizer();
  }, [ctx]);

  // Fetch forms on mount
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get API key from plugin parameters
      const apiKey = ctx.plugin?.attributes?.parameters?.hubspotApiKey;
      
      if (!apiKey) {
        throw new Error('HubSpot API key not configured. Please configure it in the plugin settings.');
      }
      
      const url = forceRefresh ? `${API_ENDPOINT}?refresh=true` : API_ENDPOINT;
      const response = await fetch(url, {
        headers: {
          'X-HubSpot-API-Key': apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch forms: ${response.status}`);
      }
      
      const data = await response.json();
      setForms(data.results || []);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter forms based on search
  const filteredForms = useMemo(() => {
    if (!searchTerm) return forms;
    
    const search = searchTerm.toLowerCase();
    return forms.filter(form => 
      form.name.toLowerCase().includes(search)
    );
  }, [forms, searchTerm]);

  // Handle form selection
  const handleSelectForm = (value) => {
    setSelectedForm(value);
    if (ctx.fieldPath) {
      ctx.setFieldValue(ctx.fieldPath, value);
    }
  };

  // Get selected form details
  const currentForm = forms.find(f => f.id === selectedForm);

  if (loading && forms.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spinner />
        <p>Loading forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '12px'
        }}>
          Error: {error}
        </div>
        <Button onClick={() => fetchForms(true)} size="small">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <TextInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={`Search ${forms.length} forms...`}
          type="search"
          textInputProps={{
            autoComplete: 'off'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <SelectField
          value={selectedForm}
          onChange={handleSelectForm}
          options={[
            { label: 'Choose a form...', value: '' },
            ...filteredForms.map(form => ({
              label: form.name,
              value: form.id,
              hint: new Date(form.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            }))
          ]}
        />
      </div>

      {currentForm && (
        <div style={{
          background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
          border: '1px solid #e2e8f0',
          padding: '16px',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Selected Form
          </div>
          <div style={{ 
            fontSize: '14px',
            fontWeight: '500',
            color: '#0f172a',
            marginBottom: '4px'
          }}>
            {currentForm.name}
          </div>
          <div style={{ 
            fontSize: '12px',
            color: '#64748b',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            wordBreak: 'break-all',
            marginTop: '8px',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '4px'
          }}>
            {currentForm.id}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button 
          onClick={() => fetchForms(true)} 
          size="small"
          buttonType="muted"
          leftIcon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          }
        >
          Refresh
        </Button>
        
        {forms.length > 0 && (
          <span style={{
            fontSize: '12px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '8px'
          }}>
            {forms.length} forms available
          </span>
        )}
      </div>
    </div>
  );
}

export default HubSpotFormSelector;