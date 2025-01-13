using Decsys.Auth;
using Decsys.Config;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
public class FolderController: ControllerBase
{
    private readonly AppMode _mode;
    private readonly FolderService _folders;

    public FolderController(
        IOptions<AppMode> mode,
        FolderService folders)
    {
        _mode = mode.Value;
        _folders = folders;
    }
    

    [HttpPost]
    [SwaggerOperation("Create a new Folder.")]
    [SwaggerResponse(200, "The Folder was successfully created.", Type = (typeof(Folder)))]

    public IActionResult Create(string name)
    {
        string ownerId = User.GetUserId();
        var folder = _folders.Create(name, ownerId);
        return Ok(folder);
    }
}
