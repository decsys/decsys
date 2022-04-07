# Deploying new environments

We use Bicep to manage ARM deployments to Azure.

Not everything is done by ARM, so here is a list of steps for setting up a new environment, including the manual bits:

## Prerequisites

1. External MongoDB server (Could be an Azure resource e.g. Atlas SAAS or bitnami VM)
1. Optional Custom Hostname configuration
   - If you pass a custom hostname to an ARM Template, it _will_ do a cursory check of your DNS settings
   - so you need to set the DNS records as instructed in the Azure Portal
   - Consider using Azure DNS Zones to manage app DNS in Azure, next to the other resources
1. Create a SendGrid account
   - validate it
   - create an api key
1. Create a KeyVault to store client/environment relevant settings that will get used by deployment pipelines and apps
   - e.g. DB Connection string, Sendgrid API keys...
   - e.g. `decsys-dev-kv`
   - You **must** put in secrets that are expected by app settings configured by the templates else they will not be correctly linked
     - This can be fixed by redeploying the template after adding the secrets
   - Required Secrets are documented in the KeyVault section below

## Deploy Environment

Deploy the bicep file for the environment. Fill out any requested parameters.

- You'll need to be using the correct subscription and provide the correct (pre-existing) resource group name with `-g`
- Login: `az login`
- Check available subscriptions: `az account list`
- Set correct subscription: `az account set --subscription <Subscription Name>`
- Deploy correct file to correct RG: `az deployment group create -f .\.azure\bicep\main.bicep -g <DECSYS RG>`
- Provide any parameters asked for, e.g. `environment: dev`

Note that there is some resource sharing in the existing internal DECSYS environments.

So to get prod up from scratch you'd need to do:

1. `az deployment group create -f .\.azure\bicep\shared.bicep -g <DECSYS RG>`
1. `az deployment group create -f .\.azure\bicep\main.bicep -g <DECSYS RG>`

## KeyVault

We keep secrets in environment specific keyvaults, and then use those secrets in deployment pipelines and the app configuration.

### What you need to do:

1. Create a KeyVault
1. Add Secrets as required for the parts of the stack you will be deploying via ARM / DevOps.

### Create a KeyVault

There is a Bicep file for keyvault you can use if you want, or do it manually through the Portal

### Add Secrets

Here are the Secrets requirements for ARM and DevOps deployments of bits of the stack.

Those app's own READMEs may provide more details on the expected content of the secret.

The bicep files provide so much configuration via KeyVault due to the files being public. (For your own private bicep files you could inline many of these which are not truly secret but more simply private e.g. Email From Address)

| Secret Name | Description | Consumer | Use |
| - | - | - | - |
| `account-approvers` | Comma separated list of email addresses for people who can approve account registrations | ARM | App Settings |
| `api-origin` | The origin the app is hosted at, for OAuth2 e.g. `https://my-decsys.com` | ARM | App Settings |
| `db-connection-string` | Mongo Connection string for the environment's DB | ARM | App Settings |
| `decsysAdminPassword` | The value to use as the superuser password for the app | ARM | App Settings |
| `email-from-address` | The email address to send mail from | ARM | App Settings |
| `jwk-<key>` | Multiple entries; one per property of a JWK public/private key pair e.g. from https://mkjwk.org | ARM | App Settings |
| `sendgrid-api-key` | SendGrid API key | ARM | App Settings |
