import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, Button, TextInput, Spinner } from 'datocms-react-ui';

const API_ENDPOINT = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/hubspot-forms'
  : '/api/hubspot-forms';

function HubSpotFormSelector({ ctx }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debug logging (removed for production)
  // console.log('HubSpotFormSelector ctx:', ctx);
  // console.log('fieldPath:', ctx.fieldPath);
  // console.log('formValues:', ctx.formValues);
  
  // Get initial value from simplified context
  const initialValue = ctx.value || '';
  
  if (initialValue) {
    console.log('Found existing form ID:', initialValue);
  }
  
  const [selectedForm, setSelectedForm] = useState(initialValue);

  // Start auto-resizer
  useEffect(() => {
    ctx.startAutoResizer();
  }, [ctx]);

  // Fetch forms on mount
  useEffect(() => {
    fetchForms();
  }, []);
  
  // Update selected form when initial value changes or forms load
  useEffect(() => {
    if (initialValue && forms.length > 0 && !selectedForm) {
      const formExists = forms.find(f => f.id === initialValue);
      if (formExists) {
        setSelectedForm(initialValue);
        console.log('Set selected form to saved value:', initialValue, formExists.name);
      }
    }
  }, [initialValue, forms]);

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
    console.log('Selected form ID:', value);
    setSelectedForm(value);
    
    // Use the simplified onChange
    if (ctx.onChange) {
      ctx.onChange(value);
      
      // Show success feedback
      if (value && forms.length > 0) {
        const form = forms.find(f => f.id === value);
        if (form) {
          console.log('Form saved:', form.name, '(', value, ')');
        }
      }
    }
  };

  // Get selected form details
  const currentForm = forms.find(f => f.id === selectedForm);

  if (loading && forms.length === 0) {
    return (
      <Canvas ctx={ctx}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spinner />
          <p>Loading forms...</p>
        </div>
      </Canvas>
    );
  }

  if (error) {
    return (
      <Canvas ctx={ctx}>
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
      </Canvas>
    );
  }

  return (
    <Canvas ctx={ctx}>
      {/* Show current selection if form hasn't loaded yet */}
      {initialValue && !currentForm && forms.length === 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          padding: '8px 12px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          Loading saved form: {initialValue}
        </div>
      )}
      
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

      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <select
          value={selectedForm}
          onChange={(e) => handleSelectForm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: '#fff',
            height: '250px',
            overflowY: 'auto',
            cursor: 'pointer'
          }}
          size="10"
        >
          <option value="">Choose a form...</option>
          {filteredForms.map(form => (
            <option key={form.id} value={form.id}>
              {form.name} ({new Date(form.createdAt).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {selectedForm && currentForm && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #0284c7',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          <div style={{ 
            fontWeight: '500',
            color: '#0c4a6e',
            marginBottom: '4px'
          }}>
            ✓ Selected: {currentForm.name}
          </div>
          <div style={{ 
            fontSize: '11px',
            color: '#64748b',
            fontFamily: 'monospace',
            wordBreak: 'break-all'
          }}>
            ID: {currentForm.id}
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
    </Canvas>
  );
}

export default HubSpotFormSelector;