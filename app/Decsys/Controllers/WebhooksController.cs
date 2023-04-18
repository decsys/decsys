using Decsys.Auth;
using Decsys.Models.Webhooks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
public class WebhooksController
{
    [HttpPost]
    [SwaggerOperation("Create a webhook")]
    [SwaggerResponse(201, "Webhook created.")]
    public async Task<IActionResult> Create(WebhookModel webhook)
    {
        
        
        
        
        return Ok(webhook);
    }
    
}
