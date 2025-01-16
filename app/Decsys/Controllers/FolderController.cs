using Decsys.Auth;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
public class FolderController: ControllerBase
{
    private readonly FolderService _folders;

    public FolderController(
        FolderService folders)
    {
        _folders = folders;
    }
    
    [HttpPost]
    [SwaggerOperation("Create a new Folder.")]
    [SwaggerResponse(200, "The Folder was successfully created.", Type = (typeof(Folder)))]
    [SwaggerResponse(401, "Unauthorized.")]
    public async Task<IActionResult> Create(string name)
    {
        string ownerId = User.GetUserId();
        try
        {
            var folder = await _folders.Create(name, ownerId);
            return Ok(folder);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }


    [HttpGet("{name}")]
    [SwaggerOperation("Check if a Folder with the given name exists.")]
    [SwaggerResponse(204, "No folder found with the given name.")]
    [SwaggerResponse(200, "A folder with the given name exists.", Type = typeof(Folder))]
    [SwaggerResponse(401, "Unauthorized.")]
    public async Task<IActionResult> CheckIfFolderExists(string name)
    {
        string ownerId = User.GetUserId();
        try
        {
            var folder = await _folders.GetByName(name, ownerId);
            if (folder == null)
                return NoContent(); 
            return Ok(folder); 
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }

    [HttpGet]
    [SwaggerOperation("Get all folders for the current user.")]
    [SwaggerResponse(200, "Returns a list of folders.", Type = typeof(IEnumerable<Folder>))]
    [SwaggerResponse(401, "Unauthorized.")]
    public async Task<IActionResult> ListFolders()
    {
        try
        {
            string ownerId = User.GetUserId(); 
            var folders = await _folders.List(ownerId);
            return Ok(folders);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}
