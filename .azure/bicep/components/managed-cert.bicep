param appName string
param hostname string
param aspId string

var location = resourceGroup().location


// https://docs.microsoft.com/en-us/azure/templates/microsoft.web/2020-09-01/certificates
module cert 'br/DrsComponents:managed-cert.bicep:v1' = {
  name: '${appName}_${hostname}-cert'
  params: {
    appName: appName
    hostname: hostname
    aspId: aspId
    location: location
  }
}

// update the existing app's binding with the cert details
resource hostNameSsl 'Microsoft.Web/sites@2020-06-01' = {
  name: appName
  location: location
  properties: {
    hostNameSslStates: [
      {
        name: hostname
        sslState: 'SniEnabled'
        thumbprint: cert.properties.thumbprint
        toUpdate: true
      }
    ]
  }
}
