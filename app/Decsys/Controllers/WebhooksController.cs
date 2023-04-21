using Decsys.Auth;
using Decsys.Models.Webhooks;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers;

[ApiController]
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
    public async Task<IActionResult> Create(WebhookModel webhook)
        => Ok(_webhooks.Create(webhook));
    
}
