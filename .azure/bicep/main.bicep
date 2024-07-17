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

param frontendAppName string = '${env}-${serviceName}'
param frontendHostnames array = []

param backendAppName string = '${env}-${serviceName}-api'
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

// Create the Frontend App and related bits
// App Insights
// App Service
// Hostnames
module frontend 'br/DrsComponents:app-service:v1' = {
  name: 'frontend-${uniqueString(frontendAppName)}'
  params: {
    location: location
    appName: frontendAppName
    aspName: asp.outputs.name
    logAnalyticsWorkspaceName: la.outputs.name
    appHostnames: frontendHostnames
    tags: {
      ServiceScope: serviceName
      Environment: env
    }
  }
}

// Create the Backend App and related bits
// App Insights
// App Service
// Hostnames
module backend 'br/DrsComponents:app-service:v1' = {
  name: 'backend-${uniqueString(backendAppName)}'
  params: {
    location: location
    appName: backendAppName
    aspName: asp.outputs.name
    logAnalyticsWorkspaceName: la.outputs.name
    tags: {
      ServiceScope: serviceName
      Environment: env
    }
  }
}

// Grant frontend Key Vault access
module frontendKvAccess 'br/DrsConfig:keyvault-access:v2' = {
  name: 'kvAccess-${uniqueString(frontend.name)}'
  params: {
    keyVaultName: kv.name
    principalId: frontend.outputs.identity.principalId
  }
}
// Grant backend Key Vault access
module backendKvAccess 'br/DrsConfig:keyvault-access:v2' = {
  name: 'kvAccess-${uniqueString(backend.name)}'
  params: {
    keyVaultName: kv.name
    principalId: backend.outputs.identity.principalId
  }
}

// Config (App Settings, Connection strings) here now that Key Vault links will resolve
// Overrides for environments come through as params

// Shared configs are defined inline here
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
  Default: {
    type: 'SQLServer'
    value: referenceSecret(keyVaultName, 'db-connection-string')
  }
}

// Shared App Service
var sharedSettings = {
  WorkshopMode: false

  DOTNET_Environment: friendlyEnvironmentNames[env]

  // App specific Azure/AI config
  APPLICATIONINSIGHTS_CONNECTION_STRING: backend.outputs.appInsights.connectionString
  WEBSITE_RUN_FROM_PACKAGE: 1

  // Default app settings
  Hosted__AdminPassword: referenceSecret(keyVaultName, 'decsys-admin-password')
  Hosted__AdminUsername: 'decsys'

  Hosted__AllowRegistration: true
  Hosted__AccountApprovalRequired: true

  Hosted__OutboundEmail__FromName: 'DECSYS'
  Hosted__OutboundEmail__Provider: 'sendgrid'
  Hosted__OutboundEmail__SendGridApiKey: referenceSecret(keyVaultName, 'sendgrid-api-key')


  Hosted__Origin: backend.outputs.defaultUrl
  Hosted__AccountApprovers: referenceSecret(keyVaultName, 'account-approvers')

  Hosted__JwtSigningKey__kid: 'decsys-test'
  Hosted__JwtSigningKey__use: 'sig'
  Hosted__JwtSigningKey__kty: 'RSA'
  Hosted__JwtSigningKey__alg: 'RS256'
  Hosted__JwtSigningKey__d: referenceSecret(keyVaultName, 'decsys-jwtkey-d')
  Hosted__JwtSigningKey__dp: referenceSecret(keyVaultName, 'decsys-jwtkey-dp')
  Hosted__JwtSigningKey__dq: referenceSecret(keyVaultName, 'decsys-jwtkey-dq')
  Hosted__JwtSigningKey__e: referenceSecret(keyVaultName, 'decsys-jwtkey-e')
  Hosted__JwtSigningKey__n: referenceSecret(keyVaultName, 'decsys-jwtkey-n')
  Hosted__JwtSigningKey__p: referenceSecret(keyVaultName, 'decsys-jwtkey-p')
  Hosted__JwtSigningKey__q: referenceSecret(keyVaultName, 'decsys-jwtkey-q')
  Hosted__JwtSigningKey__qi: referenceSecret(keyVaultName, 'decsys-jwtkey-qi')
}

module backendSiteConfig 'br/DrsConfig:webapp:v1' = {
  name: 'siteConfig-${uniqueString(backend.name)}'
  params: {
    appName: backend.outputs.name
    appSettings: union(appInsightsSettings, sharedSettings, appSettings)
    connectionStrings: dbConnectionStrings
  }
}

module frontendSiteConfig 'br/DrsConfig:webapp:v1' = {
  name: 'siteConfig-${uniqueString(frontend.name)}'
  params: {
    appName: frontend.outputs.name
    appSettings: union(appInsightsSettings, sharedSettings, appSettings)
    connectionStrings: dbConnectionStrings
  }
}
