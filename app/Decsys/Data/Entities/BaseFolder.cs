namespace Decsys.Data.Entities;

public class BaseFolder
{
    public string Name { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public int SurveyCount { get; set; }
}
