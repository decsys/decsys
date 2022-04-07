var env = 'shared'
param logAnalyticsWorkspaceName string

module la './components/log-analytics-workspace.bicep' = {
  name: 'la-ws-${uniqueString(env)}'
  params: {
    logAnalyticsWorkspaceName: logAnalyticsWorkspaceName
  }
}
