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
    /// <param name> Folder name to create </param>
    /// <returns> the created folder
    public string Create(string name, string? ownerId =null)
        => _folders.Create(name, ownerId);
    
}
