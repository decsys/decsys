namespace Decsys.Data.Entities.LiteDb;

public class Folder
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public int SurveyCount { get; set; }

}
