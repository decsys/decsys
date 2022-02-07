param env string = 'dev'

param keyVaultName string
param appName string
param logAnalyticsWorkspaceName string

resource kv 'Microsoft.KeyVault/vaults@2020-04-01-preview' existing = {
  name: keyVaultName
}

module asp './components/app-service-plan.bicep' = {
  name: 'asp-${uniqueString(env)}'
  params: {
    aspName: '${appName}-asp'
    sku: 'P1V2'
    tags: {
      Environment: env
    }
  }
}

var dbConnectionString = '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=db-connection-string)'

module web 'web.bicep' = {
  name: 'web-${uniqueString(env)}'
  params: {
    env: env
    appName: appName
    aspName: asp.outputs.name
    keyVaultName: kv.name
    dbConnectionString: dbConnectionString
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
    appSettings: {}
  }
}
