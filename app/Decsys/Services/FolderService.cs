using Decsys.Models;
using Decsys.Repositories.Contracts;

namespace Decsys.Services;

public class FolderService
{
    private readonly IFolderRepository _folders;

    public FolderService(IFolderRepository folders)
    {
        _folders = folders;
    }

    /// <summar>
    /// Creates a folder
    /// </summary>
    /// <param name="name"> Folder name to create </param>
    /// <param name="ownerId">ID of the folder owner.</param>
    /// <returns>The created folder.</returns>
    public async Task<Folder> Create(string name, string? ownerId =null)
        => await _folders.Create(name, ownerId);

    /// <summary>
    /// Checks if a folder with the given name exists.
    /// </summary>
    /// <param name="name">Folder name to check.</param>
    /// <returns>The folder if found, null otherwise.</returns>
    public async Task<Folder?> GetByName(string name, string? ownerId = null)
        => await _folders.GetByName(name, ownerId);

    /// <summary>
    /// Lists all folders for a specific owner.
    /// </summary>
    /// <param name="ownerId">ID of the folder owner.</param>
    /// <param name="pageIndex">The index of the page to retrieve.</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <returns>A list of folders belonging to the owner.</returns>
    public async Task<PagedFolderSummary> List(string? ownerId, int pageIndex, int pageSize)
        => await _folders.List(ownerId,pageIndex, pageSize);

    /// <summary>
    /// Deletes folder for a specific owner.
    /// </summary>
    /// <param name="ownerId">ID of the folder owner.</param>
    /// <param name="name">Folder name to delete.</param>
    public async Task Delete(string name, string? ownerId = null)
        => await _folders.Delete(name, ownerId);
}
