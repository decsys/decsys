using AutoMapper;
using Decsys.Auth;
using Decsys.Constants;
using Decsys.Models.Wordlist;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("{wordlistId}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Retrieve a specific wordlist by ID for the current user")]
        [SwaggerResponse(200, "Wordlist retrieved successfully.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found or access denied.")]
        public async Task<IActionResult> GetById(string wordlistId)
        {
            string ownerId = User.GetUserId();

            try
            {
                var wordlist = await _service.GetById(ownerId, wordlistId);
                return Ok(wordlist);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPut("{id}/name")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Edit the Name of a single Wordlist by ID.")]
        [SwaggerResponse(200, "The Wordlist Name was updated successfully.")]
        [SwaggerResponse(400, "No valid name was provided.")]
        [SwaggerResponse(404, "No Wordlist was found with the provided ID.")]
        public ActionResult<string> EditName(string id, [FromBody] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest($"{nameof(name)} must not be empty.");

            try
            {
                _service.UpdateName(id, name);
                return name;
            }
            catch (KeyNotFoundException) { return NotFound(); }
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
        [SwaggerOperation("Create a new wordlist for the current user")]
        [SwaggerResponse(201, "Wordlist created.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public async Task<IActionResult> CreateWordlist([FromBody] UserWordlist request)
        {
            string ownerId = User.GetUserId();

            var wordlist = await _service.CreateWordlist(ownerId, request.Name);

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

        [HttpDelete("{wordlistId}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Delete a specific wordlist for the current user")]
        [SwaggerResponse(204, "Wordlist successfully deleted.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found.")]
        public async Task<IActionResult> DeleteWordlist(string wordlistId)
        {
            string ownerId = User.GetUserId();

            var wordlist = await _service.GetById(ownerId, wordlistId);

            if (wordlist == null)
            {
                return NotFound("Wordlist not found.");
            }

            await _service.Delete(wordlistId);

            return NoContent();
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

   
        [HttpPost("{wordlistId}")] 
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Added a custom word for the current user")]
        [SwaggerResponse(200, "Custom Word Added.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found.")]
        public async Task<IActionResult> AddCustomWord(string wordlistId, [FromBody] WordlistWord wordlistWord)
        {
            if (string.IsNullOrWhiteSpace(wordlistWord.Type) || string.IsNullOrWhiteSpace(wordlistWord.Word))
            {
                return BadRequest("Invalid type or word.");
            }

            wordlistWord.Type = wordlistWord.Type.ToLowerInvariant();

            if (wordlistWord.Type != WordType.Noun.ToString().ToLowerInvariant() && wordlistWord.Type != WordType.Adjective.ToString().ToLowerInvariant())
            {
                return BadRequest("Invalid type. Type can only be 'Noun' or 'Adjective'.");
            }

            string ownerId = User.GetUserId();
            
            var customWord = await _service.AddCustomWord(ownerId, wordlistId, wordlistWord.Type, wordlistWord.Word);
            return Ok(customWord);

        }

        [HttpPut("{wordlistId}/exclude/{type}/{word}")]
        [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Update or create an exclusion for a specific word in a specified wordlist")]
        [SwaggerResponse(200, "Word exclusion updated or created.")]
        [SwaggerResponse(400, "Bad request: Invalid type or word.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        [SwaggerResponse(404, "Wordlist not found")]
        public async Task<IActionResult> SetExcludedBuiltins(string wordlistId, WordType type, string word)
        {
            string ownerId = User.GetUserId();
            var wordlist = await _service.GetById(ownerId, wordlistId);
            if (wordlist == null)
            {
                return NotFound("Wordlist not found.");
            }

            if (string.IsNullOrWhiteSpace(word))
            {
                return BadRequest("Invalid word.");
            }

            string typeString = type.ToString().ToLowerInvariant();

            var result = await _service.SetExcludedBuiltins(wordlistId, typeString, word);

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

