---
title: Security
---

## Secrets in Webhooks

### What are Secrets?
Secrets in webhooks are unique tokens used for authentication and verification. They ensure that incoming webhook requests are from a legitimate source.

### Configuring and Verifying Secrets:
1. **Configuring a Secret:** When setting up a webhook, you can generate a secret, which is then included in each webhook request.
2. **Verifying a Secret:** Upon receiving a webhook request, compare the secret in the request with your stored secret to confirm authenticity.

### Generating a Secret Automatically
1. **Selecting the Secret Generation Button:** Choose to generate a secret in the webhook configuration settings. The system will create a high-entropy secret automatically.
2. **Storing the Secret:** Securely store the secret for future validation of incoming webhook requests.

### Using Your Own Secret
1. **High Entropy:** Choose a random string of characters that is complex and unpredictable.
2. **Sufficient Length:** Aim for at least 16 characters, with more being preferable for enhanced security.
3. **Character Variety:** Use a mix of uppercase and lowercase letters, numbers, and special characters.
4. **Avoid Common Words or Phrases:** Steer clear of easily guessable information.
5. **Entering Your Secret:** Manually input your created secret in the webhook settings.

### Leaving the Secret Field Empty
1. **Option for Non-Sensitive Data:** If the webhook handles non-sensitive data, you might opt not to use a secret.
2. **Internal Use and Development:** Suitable for secure, internal networks, or during development and testing phases.
3. **Consider Security Implications:** Be aware that not using a secret can expose your application to potential security risks, especially in production environments.

### Editing Secrets
#### Consider the Implications of Secret Changes
- **Integration Impact:** Changing the webhook secret will necessitate updates to all systems that use it. This is crucial to ensure continued integration functionality.
- **Replacing a Lost Secret:** If the secret is lost or forgotten, it can be replaced. However, this should be done understanding the widespread effect it will have on the operation of your webhook.

#### Procedure for Secret Modification
- **Updating the Secret:**
  - While editing a webhook, Click change secret.
  - Generate a new secret by clicking the generate secret button which will populate the secret field.
  - Leaving the field empty will remove the current secret.
- **Maintaining Current Setup:**
  - If you choose not to change the secret, simply cancel the editing process to keep the existing one.
- **Consistency Check:**
  - After any modification, verify that the updated secret is reflected correctly in all systems connected to the webhook to prevent any data transmission issues.

Handling the webhook secret requires a balance between maintaining security and ensuring seamless integration functionality. Be mindful of these aspects when making any changes.

**Note:** For most production use cases, especially those dealing with sensitive data or exposed to the public internet, using a secret is highly recommended for security.

## SSL Verification in Webhooks

### What is SSL?
SSL (Secure Sockets Layer) is a security protocol for encrypted communication between a web server and a browser.

### Disabling SSL Verification:
- Disabling SSL verification means the webhook receiver won't validate the SSL certificate of incoming requests. 
- This might be useful in development environments, internal networks, or with legacy systems.

### Why Disable SSL Verification?
- **Development Purposes:** For testing in environments where security is not the primary concern.
- **Internal Networks:** In scenarios where SSL isn't used or custom certificates are in place.
- **Legacy Systems:** Older systems might not support modern SSL standards.

**Note:** Disabling SSL verification in production is not recommended as it compromises security.
