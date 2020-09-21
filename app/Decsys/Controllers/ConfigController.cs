using Decsys.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class ConfigController : ControllerBase
    {
        private readonly AppMode _mode;
        private readonly IConfiguration _config;

        public ConfigController(IOptions<AppMode> mode, IConfiguration config)
        {
            _mode = mode.Value;
            _config = config;
        }

        [HttpGet]
        public IActionResult Index() => new JsonResult(new
        {
            mode = _mode.IsWorkshop ? "workshop" : "hosted",
            allowRegistration = _config.GetValue<bool>("Hosted:AllowRegistration"),
            accountApprovalRequired = _config.GetValue<bool>("Hosted:AccountApprovalRequired")
        });
    }
}
