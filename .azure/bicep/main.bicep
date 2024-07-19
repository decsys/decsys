// This deploys an entire environment stack*
// It reuses some shared resources within a resource group (e.g. prod / non-prod)
// and then deploys and configures environment specific resources
// based on parameters passed through
// for a given service and environment combination (e.g. decsys dev)

import { referenceSecret } from 'br/DrsUtils:functions:v1'
import { ConnectionStringDictionary } from 'br/DrsUtils:types:v1'

type ServiceNames = 'decsys'
param serviceName ServiceNames

type Environments = 'dev' | 'qa' | 'uat' | 'prod'
param env Environments

param appName string = '${env}-${serviceName}'
param appHostnames array = []
param appSettings object = {}

param keyVaultName string = '${serviceName}-${env}-kv'
param location string = resourceGroup().location

param sharedEnv string = 'shared'
var sharedPrefix = serviceName
param appServicePlanSku string = 'B2'

// log analytics workspace
module la 'br/DrsComponents:log-analytics-workspace:v1' = {
  name: 'la-ws-${uniqueString(sharedPrefix)}'
  params: {
    location: location
    logAnalyticsWorkspaceName: '${sharedPrefix}-la-ws'
    tags: {
      ServiceScope: serviceName
      Environment: sharedEnv
    }
  }
}

// App Service Plan
module asp 'br/DrsComponents:app-service-plan:v1' = {
  name: 'asp'
  params: {
    location: location
    aspName: '${sharedPrefix}-asp'
    sku: appServicePlanSku
    tags: {
      ServiceScope: serviceName
      Environment: sharedEnv
    }
  }
}

// Per Environment Resources

// Environment Key Vault pre-existing and populated
resource kv 'Microsoft.KeyVault/vaults@2019-09-01' existing = {
  name: keyVaultName
}

// Create the Decsys App and related bits
// App Insights
// App Service
// Hostnames
module decsys 'br/DrsComponents:app-service:v1' = {
  name: 'decsys-${uniqueString(appName)}'
  params: {
    location: location
    appName: appName
    aspName: asp.outputs.name
    logAnalyticsWorkspaceName: la.outputs.name
    appHostnames: appHostnames
    tags: {
      ServiceScope: serviceName
      Environment: env
    }
  }
}


// Grant decsys Key Vault access
module decsysKvAccess 'br/DrsConfig:keyvault-access:v1' = {
  name: 'kvAccess-${uniqueString(decsys.name)}'
  params: {
    keyVaultName: kv.name
    objectId: decsys.outputs.identity.principalId
    tenantId:decsys.outputs.identity.tenantId
  }
}

// Config (App Settings, Connection strings) here now that Key Vault links will resolve
// Overrides for environments come through as params

// Decsys configs are defined inline here
var appInsightsSettings = {
  // App Insights
  ApplicationInsightsAgent_EXTENSION_VERSION: '~2'
  XDT_MicrosoftApplicationInsights_Mode: 'recommended'
  DiagnosticServices_EXTENSION_VERSION: '~3'
  APPINSIGHTS_PROFILERFEATURE_VERSION: '1.0.0'
  APPINSIGHTS_SNAPSHOTFEATURE_VERSION: '1.0.0'
  InstrumentationEngine_EXTENSION_VERSION: '~1'
  SnapshotDebugger_EXTENSION_VERSION: '~1'
  XDT_MicrosoftApplicationInsights_BaseExtensions: '~1'
}

var friendlyEnvironmentNames = {
  dev: 'Dev'
  qa: 'QA'
  uat: 'UAT'
  prod: 'Production'
}

var dbConnectionStrings = {
  mongo: {
    type: 'Custom'
    value: referenceSecret(keyVaultName, 'db-connection-string')
  }
}

// Default  App Service
var defaultSettings = {
  WorkshopMode: false

  DOTNET_Environment: friendlyEnvironmentNames[env]

  // App specific Azure/AI config
  APPLICATIONINSIGHTS_CONNECTION_STRING: decsys.outputs.appInsights.connectionString
  WEBSITE_RUN_FROM_PACKAGE: 1

  // Default app settings
  Hosted__AdminPassword: referenceSecret(keyVaultName, 'decsysAdminPassword')
  Hosted__AdminUsername: 'decsys'

  Hosted__AllowRegistration: true
  Hosted__AccountApprovalRequired: true

  Hosted__OutboundEmail__FromName: 'DECSYS'
  Hosted__OutboundEmail__Provider: 'sendgrid'
  Hosted__OutboundEmail__SendGridApiKey: referenceSecret(keyVaultName, 'sendgrid-api-key')
  Hosted__OutboundEmail__FromAddress: referenceSecret(keyVaultName, 'email-from-address')

  Hosted__Origin: decsys.outputs.defaultUrl
  Hosted__AccountApprovers: referenceSecret(keyVaultName, 'account-approvers')

  Hosted__JwtSigningKey__kid: 'decsys-test'
  Hosted__JwtSigningKey__use: 'sig'
  Hosted__JwtSigningKey__kty: 'RSA'
  Hosted__JwtSigningKey__alg: 'RS256'
  Hosted__JwtSigningKey__d: referenceSecret(keyVaultName, 'jwk-d')
  Hosted__JwtSigningKey__dp: referenceSecret(keyVaultName, 'jwk-dp')
  Hosted__JwtSigningKey__dq: referenceSecret(keyVaultName, 'jwk-dq')
  Hosted__JwtSigningKey__e: referenceSecret(keyVaultName, 'jwk-e')
  Hosted__JwtSigningKey__n: referenceSecret(keyVaultName, 'jwk-n')
  Hosted__JwtSigningKey__p: referenceSecret(keyVaultName, 'jwk-p')
  Hosted__JwtSigningKey__q: referenceSecret(keyVaultName, 'jwk-q')
  Hosted__JwtSigningKey__qi: referenceSecret(keyVaultName, 'jwk-qi')
}

module decsysSiteConfig 'br/DrsConfig:webapp:v1' = {
  name: 'siteConfig-${uniqueString(decsys.name)}'
  params: {
    appName: decsys.outputs.name
    appSettings: union(appInsightsSettings, defaultSettings, appSettings)
    connectionStrings: dbConnectionStrings
  }
}
