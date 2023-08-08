using Decsys.Auth;
using Decsys.Constants;
using Decsys.Models.Webhooks;
using Decsys.Services;
using Decsys.Utilities;
using IdentityModel;
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
    
    [HttpGet("generate-secret")]
    [SwaggerOperation("Generate a webhook secret")]
    [SwaggerResponse(200, "Webhook secret generated.")]
    [SwaggerResponse(500, "Server failed to generate the secret.")]
    public IActionResult GenerateSecret()
    { 
        {
            string secret =  Crypto.GenerateId(32,  CryptoRandom.OutputFormat.Hex);
            return Ok(secret);
        }
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

        {
            var webhookId  = _webhooks.Create(model);
            return Ok(webhookId);
        }

    }
    
    [HttpGet("{surveyId}")]
    [SwaggerOperation("Get all webhooks for the given survey ID")]
    [SwaggerResponse(200, "List of webhooks found.")]
    public IActionResult List(int surveyId)
    {
        var webhooks = _webhooks.List(surveyId);
        return Ok(webhooks);
    }
    
    [HttpDelete("{id}")]
    [SwaggerOperation("Delete a webhook by its ID")]
    [SwaggerResponse(204, "Webhook successfully deleted")]
    public IActionResult Delete(string id)
    {
        _webhooks.Delete(id);
        return NoContent();
    }
}
