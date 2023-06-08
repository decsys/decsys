using Decsys.Config;
using Decsys.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.FeatureManagement;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class ConfigController : ControllerBase
    {
        private readonly AppMode _mode;
        private readonly IConfiguration _config;
        private readonly IFeatureManagerSnapshot _featureManager;

        public ConfigController(IOptions<AppMode> mode, IConfiguration config, IFeatureManagerSnapshot featureManager)
        {
            _mode = mode.Value;
            _config = config;
            _featureManager = featureManager;
        }

        [HttpGet]
        public async Task<IActionResult> Index() => new JsonResult(new
        {
            mode = _mode.IsWorkshop ? "workshop" : "hosted",
            allowRegistration = _config.GetValue<bool>("Hosted:AllowRegistration"),
            accountApprovalRequired = _config.GetValue<bool>("Hosted:AccountApprovalRequired"),
            userWordlistsEnabled = await _featureManager.IsEnabledAsync(FeatureFlags.UserWordlists)
        });
    }
}
