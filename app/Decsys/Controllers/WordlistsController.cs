using AutoMapper;
using Decsys.Auth;
using Decsys.Data.Entities;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class WordlistsController : ControllerBase
    {
        private readonly WordlistService _service;
        private readonly IMapper _mapper;
        private readonly UserManager<DecsysUser> _user;

        public WordlistsController(WordlistService service, IMapper mapper, UserManager<DecsysUser> user)
        {
            _service = service;
            _mapper = mapper;
            _user = user;
        }


        [HttpPost]
      // [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
        [SwaggerOperation("Get or create a wordlist for the current user")]
        [SwaggerResponse(200, "Wordlist created or recieved.")]
        [SwaggerResponse(401, "User is not authenticated")]
        [SwaggerResponse(403, "User is not authorized to perform this operation")]
        public async Task<IActionResult> GetOrCreate()
        {

            string OwnerId = _user.GetUserId(User);

            var wordlist = _service.List(OwnerId);

            if (wordlist == null)
            {
                await _service.Create(OwnerId);
                wordlist = _service.List(OwnerId);
            }

            var wordlistModel = _mapper.Map <Models.Wordlist.UserWordlist > (wordlist);

            return Ok(wordlistModel);
        }
    }
}

