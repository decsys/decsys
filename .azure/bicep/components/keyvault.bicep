param keyVaultName string
param tenantId string

// https://docs.microsoft.com/en-us/azure/templates/microsoft.keyvault/vaults
resource kv 'Microsoft.KeyVault/vaults@2020-04-01-preview' = {
  name: keyVaultName
  location: resourceGroup().location
  properties: {
    tenantId: tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
  }
}

output name string = kv.name
