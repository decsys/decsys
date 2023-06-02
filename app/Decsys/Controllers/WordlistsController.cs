using AutoMapper;
using Decsys.Auth;
using Decsys.Data.Entities;
using Decsys.Models.Wordlist;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WordlistsController : ControllerBase
    {
        private readonly WordlistService _service;
        private readonly IMapper _mapper;

        public WordlistsController(WordlistService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }


        [HttpPost]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Get or create a wordlist for the current user")]
        [SwaggerResponse(200, "Wordlist created or recieved.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public async Task<IActionResult> GetOrCreate()
        {
            string ownerId = User.GetUserId();

            var wordlist = _service.List(ownerId);

            if (wordlist == null)
            {
                await _service.Create(ownerId);
                wordlist = _service.List(ownerId);
            }

            return Ok(wordlist);
        }

        [HttpPut("wordlists/{wordlistId}/rules/{ruleIndex:int}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Update or create a rule for a specified wordlist")]
        [SwaggerResponse(200, "Rule updated or created.")]
        [SwaggerResponse(400, "Bad request: Index does not match any existing rule and is not the next available index.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public async Task<IActionResult> PutRule(string wordlistId, int ruleIndex, [FromBody] WordlistRules rule)
        {
            //Controller Logic
        }

    }
}

