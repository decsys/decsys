using Decsys.Auth;
using Decsys.Constants;
using Decsys.Models.Webhooks;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers;

[ApiController]
[FeatureGate(FeatureFlags.Webhook)]
[Route("api/[controller]")]
[Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
public class WebhooksController : ControllerBase
{
    private readonly WebhookService _webhooks;
 
    public WebhooksController(
        WebhookService webhooks)
    {
        _webhooks = webhooks;
    }

    [HttpPost]
    [SwaggerOperation("Create a webhook")]
    [SwaggerResponse(200, "Webhook created.")]
    [SwaggerResponse(400, "Webhook model was invalid.")]
    [SwaggerResponse(500, "Server failed to create the Webhook.")]
    public IActionResult Create(WebhookModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var webhookId  = _webhooks.Create(model);
            return Ok(webhookId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}
