namespace Decsys.Models;

public class PagedFolderSummary
{
    public List<Folder> Folders { get; set; } = new();
    public int FolderCount { get; set; }
}
