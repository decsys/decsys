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
    private readonly FolderService _folders;
    private readonly AppMode _mode;
    public FolderController(
        FolderService folders,
        IOptions<AppMode> mode)
    {
        _folders = folders;
        _mode = mode.Value;

    }

    private string? OwnerId => _mode.IsWorkshop ? null : User.GetUserId();

    [HttpPost]
    [SwaggerOperation("Create a new Folder.")]
    [SwaggerResponse(200, "The Folder was successfully created.", Type = (typeof(Folder)))]
    [SwaggerResponse(401, "Unauthorized.")]
    public async Task<IActionResult> Create(string name)
    {
        try
        {
            var folder = await _folders.Create(name, OwnerId);
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
        try
        {
            var folder = await _folders.GetByName(name, OwnerId);
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
    public async Task<IActionResult> ListFolders(
    [FromQuery] int pageIndex = 0,
    [FromQuery] int pageSize = 10)
    {
        try
        {
            var folders = await _folders.List(OwnerId, pageIndex,pageSize);
            return Ok(folders);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
    [HttpDelete("{name}")]
    [SwaggerOperation("Delete a folder with the given name.")]
    [SwaggerResponse(204, "The folder was successfully deleted.")]
    [SwaggerResponse(404, "No folder found with the given name.")]
    [SwaggerResponse(401, "Unauthorized.")]
    [SwaggerResponse(409, "Only folders that are empty can be deleted.")]
    public async Task<IActionResult> Delete(string name)
    {
        try
        {
            await _folders.Delete(name, OwnerId);
            return NoContent();  
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);  
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}
