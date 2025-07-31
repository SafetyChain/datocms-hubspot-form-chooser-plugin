# Security Guidelines

This document outlines the security measures and best practices implemented in the DatoCMS HubSpot Form Chooser plugin.

## API Key Security

### 🔒 How API Keys are Handled

1. **Storage Location**
   - API keys are stored in DatoCMS plugin parameters (server-side)
   - Never exposed in client-side code or browser storage
   - Not included in git repository or build artifacts

2. **Transmission Security**
   - API key is sent via secure HTTPS headers
   - Transmitted only between DatoCMS and your API endpoint
   - Never exposed in URLs or query parameters

3. **Access Pattern**
   ```javascript
   // API key accessed from plugin context (secure)
   const apiKey = ctx.plugin?.attributes?.parameters?.hubspotApiKey;
   
   // Sent via headers (not in URL)
   headers: {
     'X-HubSpot-API-Key': apiKey
   }
   ```

### 🛡️ Security Architecture

```
┌─────────────────┐
│   DatoCMS UI    │ ← User enters API key once
│  (Config Screen)│
└────────┬────────┘
         │ Stored securely in DatoCMS
         ▼
┌─────────────────┐
│ Plugin Context  │ ← API key in ctx.plugin.attributes.parameters
│   (Secure)      │
└────────┬────────┘
         │ HTTPS Header
         ▼
┌─────────────────┐
│  Vercel API     │ ← Proxy validates and forwards
│   Function      │
└────────┬────────┘
         │ Bearer Token
         ▼
┌─────────────────┐
│  HubSpot API    │ ← Official API endpoint
└─────────────────┘
```

## Best Practices for Users

### ✅ DO:

1. **Use Private Apps in HubSpot**
   - Create a dedicated private app for this integration
   - Grant only the minimum required scope: `forms` (read)
   - Regularly rotate your API keys

2. **Secure Your DatoCMS Account**
   - Use strong passwords
   - Enable two-factor authentication
   - Limit plugin access to trusted editors only

3. **Monitor API Usage**
   - Check HubSpot private app logs regularly
   - Monitor for unusual activity
   - Set up alerts for API limits

### ❌ DON'T:

1. **Never Share API Keys**
   - Don't include in documentation
   - Don't share in support tickets
   - Don't commit to version control

2. **Avoid Over-Permissioning**
   - Don't grant write access if only read is needed
   - Don't use super admin API keys
   - Don't reuse API keys across multiple integrations

## HubSpot Private App Setup

### Recommended Configuration:

1. **Navigate to HubSpot Settings**
   - Settings → Integrations → Private Apps

2. **Create New Private App**
   - Name: "DatoCMS Form Selector"
   - Description: "Read-only access to forms for DatoCMS integration"

3. **Set Minimal Scopes**
   ```
   ✓ forms (Read)
   ✗ forms (Write) - NOT NEEDED
   ✗ All other scopes - NOT NEEDED
   ```

4. **Copy Access Token**
   - Token format: `pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Store securely until entered in DatoCMS

## Security Features

### 1. **CORS Protection**
- API endpoint validates origin
- Only accepts requests from authorized domains
- Prevents unauthorized API access

### 2. **Rate Limiting**
- Caching reduces API calls (configurable 1-168 hours)
- Prevents excessive HubSpot API usage
- Protects against abuse

### 3. **Input Validation**
- API key format validation
- Sanitized search inputs
- Protected against injection attacks

### 4. **Error Handling**
- Generic error messages (no sensitive data exposure)
- Detailed errors logged server-side only
- User-friendly messages in UI

## Deployment Security

### Vercel Environment
- Use environment variables for fallback API key
- Enable HTTPS only
- Configure allowed domains

### Environment Variables
```bash
# .env.local (development only)
HUBSPOT_API_KEY=your-dev-key-here

# Vercel Dashboard (production)
HUBSPOT_API_KEY=your-prod-key-here
```

## Incident Response

### If API Key is Compromised:

1. **Immediate Actions**
   - Revoke the compromised key in HubSpot immediately
   - Generate a new private app token
   - Update the key in DatoCMS plugin settings

2. **Investigation**
   - Review HubSpot API logs for unauthorized access
   - Check for any data exposure
   - Identify how the key was compromised

3. **Prevention**
   - Rotate keys regularly (recommended: every 90 days)
   - Audit who has access to DatoCMS plugin settings
   - Review security practices with your team

## Compliance Considerations

### Data Protection
- No form submission data is stored by the plugin
- Only form metadata (ID, name, creation date) is cached
- Cache is temporary and server-side only

### GDPR Compliance
- No personal data is collected or stored
- API key is considered configuration data
- Users can delete plugin and all settings at any time

### Security Auditing
- Regularly review HubSpot API access logs
- Monitor Vercel function logs for anomalies
- Keep dependencies updated

## Security Checklist

Before deploying to production:

- [ ] API key has minimal required permissions (forms read-only)
- [ ] HTTPS is enforced on all endpoints
- [ ] Error messages don't expose sensitive information
- [ ] Caching is configured appropriately
- [ ] Access logs are being monitored
- [ ] Team is trained on security best practices
- [ ] Regular key rotation schedule is established
- [ ] Incident response plan is documented

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns to: [your-security-email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Additional Resources

- [HubSpot Private Apps Documentation](https://developers.hubspot.com/docs/api/private-apps)
- [DatoCMS Security Best Practices](https://www.datocms.com/docs/security)
- [Vercel Security](https://vercel.com/security)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

---

Last Updated: July 2024
Version: 1.2.0