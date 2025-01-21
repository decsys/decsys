using MongoDB.Bson;

namespace Decsys.Models;

public class Folder : ISummaryItem
{
    public string Name { get; set; } = string.Empty;
    public bool IsFolder { get; set; } = true;
    public int SurveyCount { get; set; }
}
