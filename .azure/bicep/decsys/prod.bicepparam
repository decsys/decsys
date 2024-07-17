using '../main.bicep'

param location = 'uksouth'

param serviceName = 'decsys'
param env = 'prod'

// specifying the name here allows us to reference secrets
// even though it follows the default format /shrug
param keyVaultName = '${serviceName}-${env}-kv'

