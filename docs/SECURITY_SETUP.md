# Security Setup Guide

A quick guide to securely configure the HubSpot Form Chooser plugin.

## 🔐 Quick Security Setup (5 minutes)

### Step 1: Create a Secure HubSpot Private App

1. **Login to HubSpot** → Settings → Integrations → Private Apps
2. **Click "Create a private app"**
3. **Basic Info:**
   - Name: `DatoCMS Form Selector`
   - Description: `Read-only access for form selection in DatoCMS`

4. **Scopes Tab - IMPORTANT:**
   - Search for "forms"
   - Check ONLY: `forms` (Read) ✓
   - Do NOT check Write access ❌

5. **Create app** and copy the token

### Step 2: Secure Token Storage

#### ✅ Correct Way:
1. In DatoCMS, go to Settings → Plugins
2. Find "HubSpot Form Chooser" 
3. Click Configure
4. Paste token in the secure input field
5. Click "Save configuration"

#### ❌ Never Do This:
- Don't save token in code files
- Don't share in emails or chat
- Don't commit to git
- Don't use in client-side JavaScript

### Step 3: Set Permissions

In DatoCMS:
1. **Limit who can edit plugin settings:**
   - Settings → Roles & Permissions
   - Only allow admins to modify plugins

2. **Restrict field access if needed:**
   - Can limit which editors can use HubSpot form fields

## 🛡️ Security Checklist

Before going live, verify:

- [ ] Private app has READ-ONLY access to forms
- [ ] Token is stored only in DatoCMS plugin settings
- [ ] No tokens in your codebase
- [ ] HTTPS is enabled on your Vercel deployment
- [ ] Only trusted users can access plugin configuration

## 🚨 If Something Goes Wrong

**Token exposed?** Do this immediately:
1. Go to HubSpot → Private Apps
2. Click on your app → "Revoke token"
3. Create a new token
4. Update in DatoCMS plugin settings

## 📊 Monitor Security

### Check Monthly:
- HubSpot: Review API usage in private apps
- DatoCMS: Audit who has plugin access
- Vercel: Check function logs for errors

### Red Flags to Watch For:
- Unexpected spike in API calls
- Errors mentioning authentication
- Forms failing to load

## 🔄 Key Rotation

Best practice: Rotate your API key every 90 days

1. Create new token in HubSpot
2. Update in DatoCMS settings
3. Revoke old token
4. Mark calendar for next rotation

## 💡 Pro Tips

1. **Use a Password Manager**
   - Store API tokens securely
   - Never rely on browser autocomplete

2. **Separate Environments**
   - Use different API keys for dev/staging/production
   - Limit dev keys to test data only

3. **Document Access**
   - Keep a list of who has access to:
     - HubSpot private apps
     - DatoCMS plugin settings
     - Vercel deployment

## Need Help?

- **HubSpot API Issues**: Check private app logs in HubSpot
- **Plugin Not Working**: Verify token has correct permissions
- **Security Concerns**: Revoke and regenerate token immediately

Remember: This plugin only READS form data. It cannot modify or delete anything in HubSpot, making it inherently safe when configured correctly.