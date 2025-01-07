namespace Decsys.Models;

public class PagedSurveySummary
{
    public List<Models.SurveySummary> Surveys { get; set; } = new();
    public int SurveyCount { get; set; }
    public int? TotalStudyCount { get; set; }
}
