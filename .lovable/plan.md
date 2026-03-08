

## Update RESEND_API_KEY Secret

### What needs to happen
The `RESEND_API_KEY` secret already exists in this remixed project but likely has no value (or the old project's value). We need to update it with your active Resend API key.

### Steps
1. Use the secret update tool to prompt you for the new RESEND_API_KEY value
2. You'll paste your Resend API key from [resend.com/api-keys](https://resend.com/api-keys)
3. The secret will be stored securely and available to your backend functions (send-proposal-notification, send-rejection-email, etc.)

### Where to find your Resend API key
- Go to [resend.com](https://resend.com) and sign in
- Navigate to **API Keys** in the sidebar
- Copy an existing key or create a new one

### Technical Details
- The secret is used by edge functions: `send-proposal-notification`, `send-rejection-email`
- No code changes are needed -- just the secret value update

