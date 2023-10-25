using System.Text.Json;
using Decsys.Auth;
using Decsys.Constants;
using Decsys.Extensions;
using Decsys.Models;
using Decsys.Models.Webhooks;
using Decsys.Services;
using Decsys.Utilities;
using IdentityModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
            string secret = Crypto.GenerateId(32, CryptoRandom.OutputFormat.Hex);
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
            var webhookId = _webhooks.Create(model);
            return Ok(webhookId);
        }
    }

    [HttpGet("{id}")]
    [SwaggerOperation("Get a webhook for the given webhook ID")]
    [SwaggerResponse(200, "Webhook found.")]
    public IActionResult Get(string id)
    {
        var webhook = _webhooks.Get(id);

        return Ok(webhook);
    }


    [HttpGet("survey/{surveyId}")]
    [SwaggerOperation("Get all webhooks for the given survey ID")]
    [SwaggerResponse(200, "List of webhooks found.")]
    public IActionResult List(int surveyId)
    {
        var webhooks = _webhooks.List(surveyId);
        return Ok(webhooks);
    }

    [HttpPut("{id}")]
    [SwaggerOperation("Edit a webhook by its ID")]
    [SwaggerResponse(200, "Webhook successfully updated")]
    [SwaggerResponse(400, "Invalid model provided")]
    [SwaggerResponse(404, "No webhook found with the specified ID and survey ID")]
    public IActionResult Edit(string id, WebhookModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid model provided.");
        }

        try
        {
            var newWebhook = _webhooks.Edit(id, model);
            return Ok(newWebhook);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation("Delete a webhook by its ID")]
    [SwaggerResponse(204, "Webhook successfully deleted")]
    public IActionResult Delete(string id)
    {
        _webhooks.Delete(id);
        return NoContent();
    }

    [HttpPost("preview")]
    [SwaggerOperation("Preview if a webhook would trigger")]
    [SwaggerResponse(200, "Webhook would be triggered")]
    [SwaggerResponse(204, "Webhook would not be triggered")]
    [SwaggerResponse(400, "Invalid request payload")]
    public async Task<IActionResult> PreviewTrigger([FromBody] PayloadModel payload)
    {
        // The ASP.NET Core model binder doesn't know what to do
        // with our derived types (from BaseEventType)
        // so we'll have to do some manual parsing of that
        // and the payload into the correct types

        // Get the request body as a JObject so we can parse bits of it ourselves
        var rawBody = await Request.GetRawBodyAsync();
        var jbody = JsonConvert.DeserializeObject<JObject>(rawBody);
        var rawEventType = jbody?["eventType"];

        switch (payload.EventType.Name)
        {
            case WebhookEventTypes.PAGE_NAVIGATION:
                // Deserialize event type to our intended target type
                var eventType = rawEventType?.ToObject<PageNavigation>();
                if (eventType is null)
                    return BadRequest("Failed to parse EventType as a valid Page Navigation event type");
                payload.EventType = eventType;

                // Deserialize payload to our intended target type
                payload.Payload = ((JObject?)payload.Payload)? // We know this model binds to a JObject <3
                    .ToObject<ParticipantResultsSummary>();

                break;
            default:
                return BadRequest(
                    $"Unrecognized Webhook Event Type: {payload.EventType.Name}");
        }

        var result = _webhooks.PreviewTrigger(payload);
        if (result?.Payload != null)
            return Ok(result);

        return NoContent();
    }
}
