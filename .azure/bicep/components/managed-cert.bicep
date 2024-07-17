param appName string
param hostname string
param aspId string

var location = resourceGroup().location


module cert 'br/DrsComponents:managed-cert:v1' = {
  name: '${appName}_${hostname}'
  params: {
    appName: appName
    hostname: hostname
    aspId: aspId
    location: location
  }
}
