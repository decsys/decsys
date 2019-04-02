using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    public class IdentityController : ControllerBase
    {
        [HttpGet("ip")]
        public string Ip() => Request.HttpContext.Connection.RemoteIpAddress.ToString();
    }
}
