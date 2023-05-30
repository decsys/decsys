using AutoMapper;
using Decsys.Auth;
using Decsys.Data.Entities;
using Decsys.Models.Wordlist;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

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
        public ActionResult<UserWordlist> GetOrCreate(int userId)
        {

            var wordlist = _service.List(userId).FirstOrDefault();

            if (wordlist == null)
            {
                var newId = _service.Create(userId);
                wordlist = _service.List(userId).FirstOrDefault(w => w.Id == newId);
            }

            var model = _mapper.Map<UserWordlist>(wordlist);

            return Ok(model);
        }
    }
}

