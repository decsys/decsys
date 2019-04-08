using System;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        [HttpPost("anonymous")]
        public string AnonymousId() => Guid.NewGuid().ToString();
    }
}
