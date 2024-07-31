using AutoMapper;
using Decsys.Auth;
using Decsys.Constants;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.FeatureManagement.Mvc;
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

        [HttpGet]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("List wordlists for the current user")]
        [SwaggerResponse(200, "Wordlist Listed.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public IActionResult List()
        {
            string ownerId = User.GetUserId();

            var wordlist = _service.ListAll(ownerId);

            return Ok(wordlist);
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

        [HttpPost("create")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Create a new wordlist for the current user")]
        [SwaggerResponse(201, "Wordlist created.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public async Task<IActionResult> CreateWordlist()
        {
            string ownerId = User.GetUserId(); 

            var wordlist = await _service.Create(ownerId);

            return CreatedAtAction(nameof(List), new { id = wordlist.Id }, wordlist);
        }

        [HttpPut("{wordlistId}/rules/{ruleIndex:int}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Update or create a rule for a specified wordlist")]
        [SwaggerResponse(200, "Rule updated or created.")]
        [SwaggerResponse(400, "Bad request: Index does not match any existing rule and is not the next available index.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public async Task<IActionResult> PutRule(string wordlistId, int ruleIndex, [FromBody] Models.Wordlist.WordlistRules rule)
        {
            string ownerId = User.GetUserId();

            var wordlist = _service.List(ownerId);

            if (ruleIndex >= 0 && ruleIndex <= wordlist.Rules.Count)
            {
                //Update or Add the rule
                await _service.PutRule(wordlistId, ruleIndex, rule);
                wordlist = _service.List(ownerId);
            }
            else
            {
                return BadRequest("Invalid rule index.");
            }

            return Ok(wordlist.Rules); 
        }

        [HttpDelete("{wordlistId}/rules/{ruleIndex:int}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Delete wordlist rules for the current user")]
        [SwaggerResponse(200, "Wordlist deleted.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found.")]
        public async Task<IActionResult> DeleteRule(string wordlistId, int ruleIndex)
        {
            string ownerId = User.GetUserId();

            var wordlist = _service.List(ownerId);

            if (wordlist == null)
            {
                return NotFound("Wordlist not found.");
            }

            if (ruleIndex < 0 || ruleIndex >= wordlist.Rules.Count)
            {
                return BadRequest("Invalid rule index.");
            }

            await _service.DeleteRule(wordlistId, ruleIndex);
            
            wordlist = _service.List(ownerId);

            return Ok(wordlist.Rules);
        }

        [HttpPut("{wordlistId}/exclude/{type}/{word}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Update or create an exclusion for a specific word in a specified wordlist")]
        [SwaggerResponse(200, "Word exclusion updated or created.")]
        [SwaggerResponse(400, "Bad request: Invalid type or word.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found")]
        public async Task<IActionResult> SetExcludedBuiltins(string wordlistId, string type, string word)
        {
            if (string.IsNullOrWhiteSpace(type) || string.IsNullOrWhiteSpace(word))
            {
                return BadRequest("Invalid type or word.");
            }

            type = type.ToLowerInvariant();

            if (type != "noun" && type != "adjective")
            {
                return BadRequest("Invalid type. Type can only be 'Noun' or 'Adjective'.");
            }

            string ownerId = User.GetUserId();

            var wordlist = _service.List(ownerId);

            if (wordlist == null)
            {
                return NotFound("Wordlist not found");
            }

            var result = await _service.SetExcludedBuiltins(wordlistId, type, word);

            return Ok(result);
        }

        [HttpDelete("{wordlistId}/exclude/{type}/{word}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Delete Word Exclusion for the current user")]
        [SwaggerResponse(204, "Excluded word deleted.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found.")]
        public async Task<IActionResult> DeleteExcludedBuiltins(string wordlistId, string type, string word)
        {
            type = type.ToLowerInvariant();

            string ownerId = User.GetUserId();

            var wordlist = _service.List(ownerId);

            if (wordlist == null)
            {
                return NotFound("Wordlist not found.");
            }
            await _service.DeleteExcludedBuiltins(wordlistId,type,word);
            return NoContent();
        }

    }
}

