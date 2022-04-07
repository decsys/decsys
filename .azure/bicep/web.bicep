param env string = 'dev'

param appSettings object = {}

param appName string
param aspName string
param keyVaultName string
param appHostnames array = []
param dbConnectionString string
param logAnalyticsWorkspaceName string

// create the app
module app 'components/web-app-service.bicep' = {
  name: 'appService-${uniqueString(appName)}'
  params: {
    aspName: aspName
    appName: appName
    appHostnames: appHostnames
    dbConnectionString: dbConnectionString
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
    tags: {
      Environment: env
    }
  }
}

// grant it keyvault access
module apiKvAccess 'config/keyvault-access.bicep' = {
  name: 'kvAccess-${uniqueString(appName)}'
  params: {
    keyVaultName: keyVaultName
    tenantId: app.outputs.tenantId
    objectId: app.outputs.principalId
  }
}

// now that keyvault is accessible, add settings (some of which are KeyVault linked)
module webAppSettings 'config/web-app-settings.bicep' = {
  name: 'appSettings-${uniqueString(appName)}'
  params: {
    appName: app.outputs.name
    appInsightsName: app.outputs.appInsightsName
    keyVaultName: keyVaultName
    appSettings: appSettings
  }
}

// this needs to be done as a separate stage to creating the app with a bound hostname
@batchSize(1) // also needs to be done serially to avoid concurrent updates to the app service
module apiCert 'components/managed-cert.bicep' = [for hostname in appHostnames: {
  name: 'api-cert-${uniqueString(hostname)}'
  params: {
    hostname: hostname
    appName: app.outputs.name
    aspId: app.outputs.aspId
  }
}]
