import React, { useState, useEffect, useMemo } from 'react';
import { Canvas, Button, TextInput, Spinner } from 'datocms-react-ui';
import 'datocms-react-ui/styles.css';
import { get } from 'lodash';

const API_ENDPOINT = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/hubspot-forms'
  : '/api/hubspot-forms';

function HubSpotFormSelector({ ctx }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Get current value using lodash get as recommended
  const currentValue = get(ctx.formValues, ctx.fieldPath) || '';
  
  const [selectedForm, setSelectedForm] = useState(currentValue);
  
  // Get display settings
  const showDates = ctx.plugin?.attributes?.parameters?.showDates !== false;

  // Use manual height control to ensure proper iframe height
  useEffect(() => {
    if (ctx.updateHeight) {
      // Set a height that fits content without extra space
      ctx.updateHeight(480);
    }
  }, [ctx, forms, loading, error]);

  // Fetch forms on mount
  useEffect(() => {
    fetchForms();
  }, []);
  
  // Update selected form when current value changes or forms load
  useEffect(() => {
    if (currentValue && forms.length > 0) {
      const formExists = forms.find(f => f.id === currentValue);
      if (formExists && selectedForm !== currentValue) {
        setSelectedForm(currentValue);
        console.log('Set selected form to saved value:', currentValue, formExists.name);
      }
    }
  }, [currentValue, forms]);

  const fetchForms = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      console.log('Refreshing forms from HubSpot...');
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Get API key and settings from plugin parameters
      const apiKey = ctx.plugin?.attributes?.parameters?.hubspotApiKey;
      const filterArchived = ctx.plugin?.attributes?.parameters?.filterArchived !== false;
      const cacheHours = ctx.plugin?.attributes?.parameters?.cacheHours || 24;
      
      if (!apiKey) {
        throw new Error('HubSpot API key not configured. Please configure it in the plugin settings.');
      }
      
      const params = new URLSearchParams();
      if (forceRefresh) params.append('refresh', 'true');
      params.append('filterArchived', filterArchived.toString());
      params.append('cacheHours', cacheHours.toString());
      
      const url = `${API_ENDPOINT}?${params.toString()}`;
      console.log('Fetching forms from:', url);
      
      const response = await fetch(url, {
        headers: {
          'X-HubSpot-API-Key': apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch forms: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.results?.length || 0} forms`);
      setForms(data.results || []);
      
      if (forceRefresh && ctx.notice) {
        ctx.notice('Forms refreshed successfully!');
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    
    // Use setFieldValue as recommended by DatoCMS docs
    ctx.setFieldValue(ctx.fieldPath, value);
    
    // Show success feedback
    if (value && forms.length > 0) {
      const form = forms.find(f => f.id === value);
      if (form) {
        console.log('Form saved:', form.name, '(', value, ')');
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
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <h2 style={{
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        margin: '0 0 20px 0',
        color: '#333',
        letterSpacing: '0.5px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}>
        SafetyChain HubSpot Form Search Plugin
      </h2>
      
      {/* Show current selection if form hasn't loaded yet */}
      {currentValue && !currentForm && forms.length === 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          padding: '8px 12px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          Loading saved form: {currentValue}
        </div>
      )}
      
      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#94a3b8'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${forms.length} forms...`}
          type="text"
          style={{
            width: '100%',
            padding: '12px 16px 12px 44px',
            fontSize: '14px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: '#fff',
            boxSizing: 'border-box',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#0ea5e9';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
          }}
        />
      </div>

      <div style={{ 
        marginBottom: '16px',
        maxHeight: '200px',
        overflow: 'hidden'
      }}>
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
            height: '200px',
            overflowY: 'auto',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}
          size={8}
        >
          <option value="">Choose a form...</option>
          {filteredForms.map(form => (
            <option key={form.id} value={form.id}>
              {form.name}{showDates && ` (${new Date(form.createdAt).toLocaleDateString()})`}
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
          fontSize: '14px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
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
          disabled={refreshing}
          leftIcon={refreshing ? (
            <div style={{ animation: 'spin 1s linear infinite' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </div>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          )}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        
        {forms.length > 0 && (
          <span style={{
            fontSize: '14px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}>
            {forms.length} forms available
          </span>
        )}
      </div>
      </div>
    </Canvas>
  );
}

export default HubSpotFormSelector;