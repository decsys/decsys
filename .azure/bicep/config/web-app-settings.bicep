param keyVaultName string
param appInsightsName string
param appName string
param appSettings object = {}

// prefix for a key vault secret reference
// don't forget to close the bracket at the end!
var kvRef = '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName='

var sharedSettings = {
  WorkshopMode: false

  Hosted__AdminUsername: 'decsys'
  Hosted__AdminPassword: '${kvRef}decsysAdminPassword)'
  
  Hosted__AllowRegistration: true
  Hosted__AccountApprovalRequired: true
  
  Hosted__OutboundEmail__FromName: 'DECSYS'
  Hosted__OutboundEmail__Provider: 'sendgrid'
  Hosted__OutboundEmail__SendGridApiKey: '${kvRef}sendgrid-api-key)'

  // secrets
  Hosted__Origin: '${kvRef}api-origin)'
  Hosted__AccountApprovers: '${kvRef}account-approvers)'

  Hosted__JwtSigningKey__p: '${kvRef}jwk-p)'
  Hosted__JwtSigningKey__kty: '${kvRef}jwk-kty)'
  Hosted__JwtSigningKey__q: '${kvRef}jwk-q)'
  Hosted__JwtSigningKey__d: '${kvRef}jwk-d)'
  Hosted__JwtSigningKey__e: '${kvRef}jwk-e)'
  Hosted__JwtSigningKey__use: '${kvRef}jwk-use)'
  Hosted__JwtSigningKey__kid: '${kvRef}jwk-kid)'
  Hosted__JwtSigningKey__qi: '${kvRef}jwk-qi)'
  Hosted__JwtSigningKey__dp: '${kvRef}jwk-dp)'
  Hosted__JwtSigningKey__alg: '${kvRef}jwk-alg)'
  Hosted__JwtSigningKey__dq: '${kvRef}jwk-dq)'
  Hosted__JwtSigningKey__n: '${kvRef}jwk-n)'

  Hosted__OutboundEmail__FromAddress: '${kvRef}email-from-address)'
}

resource appinsights 'microsoft.insights/components@2020-02-02-preview' existing = {
  name: appInsightsName
}
var appInsightsSettings = {
  APPLICATIONINSIGHTS_CONNECTION_STRING: appinsights.properties.ConnectionString
  ApplicationInsightsAgent_EXTENSION_VERSION: '~3'
  XDT_MicrosoftApplicationInsights_Mode: 'recommended'
  DiagnosticServices_EXTENSION_VERSION: '~3'
  APPINSIGHTS_PROFILERFEATURE_VERSION: '1.0.0'
  APPINSIGHTS_SNAPSHOTFEATURE_VERSION: '1.0.0'
  InstrumentationEngine_EXTENSION_VERSION: '~3'
  SnapshotDebugger_EXTENSION_VERSION: '~3'
  XDT_MicrosoftApplicationInsights_BaseExtensions: '~3'
}

// https://docs.microsoft.com/en-us/azure/templates/microsoft.web/2020-09-01/sites/config-appsettings
resource settings 'Microsoft.Web/sites/config@2020-09-01' = {
  name: '${appName}/appsettings'
  properties: union(appInsightsSettings, sharedSettings, appSettings)
}
