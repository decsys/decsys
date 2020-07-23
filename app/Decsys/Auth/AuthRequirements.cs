using Microsoft.AspNetCore.Authorization;

//This file contains stub requirements

namespace Decsys.Auth
{
    /// <summary>
    /// Requires that the site is being requested from the machine running the server
    /// </summary>
    public class LocalMachineRequirement : IAuthorizationRequirement { }
}
