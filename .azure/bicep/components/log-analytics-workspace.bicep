param logAnalyticsWorkspaceName string

var location = resourceGroup().location

// https://docs.microsoft.com/en-us/azure/templates/microsoft.operationalinsights/2021-06-01/workspaces?tabs=bicep
resource laWorkspace 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

output name string = laWorkspace.name
output id string = laWorkspace.id
