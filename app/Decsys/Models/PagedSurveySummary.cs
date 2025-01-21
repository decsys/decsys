namespace Decsys.Models;

public class PagedSurveySummary
{
    public List<ISummaryItem> Items { get; set; } = new();
    public int SurveyCount { get; set; }
    public int? TotalStudyCount { get; set; }
}
