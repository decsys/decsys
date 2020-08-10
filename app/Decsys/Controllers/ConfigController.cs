using Decsys.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class ConfigController : ControllerBase
    {
        private readonly AppMode _mode;

        public ConfigController(IOptions<AppMode> mode)
        {
            _mode = mode.Value;
        }

        [HttpGet]
        public string Index() => _mode.IsWorkshop ? "workshop" : "hosted";
    }
}
