namespace Decsys.Models;

public class PagedSurveySummary
{
    public List<ISummaryItem> SurveyItems { get; set; } = new();
    public int SurveyCount { get; set; }
    public int? StudyCount { get; set; }
    public int? FolderCount { get; set; }
}
