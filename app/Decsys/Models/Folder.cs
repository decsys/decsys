using MongoDB.Bson;

namespace Decsys.Models;

public class Folder
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int SurveyCount { get; set; }    
}
