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
  const [selectedForm, setSelectedForm] = useState(ctx.formValues[ctx.fieldPath] || '');

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
      const url = forceRefresh ? `${API_ENDPOINT}?refresh=true` : API_ENDPOINT;
      const response = await fetch(url);
      
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
    ctx.setFieldValue(ctx.fieldPath, value);
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
    <div style={{ padding: '12px' }}>
      <div style={{ marginBottom: '12px' }}>
        <TextInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={`Search ${forms.length} forms by name...`}
          type="search"
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <SelectField
          value={selectedForm}
          onChange={handleSelectForm}
          options={[
            { label: 'Select a form...', value: '' },
            ...filteredForms.map(form => ({
              label: `${form.name} (${new Date(form.createdAt).toLocaleDateString()})`,
              value: form.id
            }))
          ]}
        />
      </div>

      {currentForm && (
        <div style={{
          background: '#f5f5f5',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '12px',
          marginBottom: '12px'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            Currently selected:
          </div>
          <div style={{ color: '#0073e6', marginBottom: '2px' }}>
            {currentForm.name}
          </div>
          <div style={{ 
            color: '#666',
            fontFamily: 'monospace',
            fontSize: '11px',
            wordBreak: 'break-all'
          }}>
            ID: {currentForm.id}
          </div>
        </div>
      )}

      <Button 
        onClick={() => fetchForms(true)} 
        size="small"
        buttonType="muted"
        leftIcon={<span>🔄</span>}
      >
        Refresh Forms
      </Button>
    </div>
  );
}

export default HubSpotFormSelector;