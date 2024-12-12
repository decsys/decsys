namespace Decsys.Models;

public class PagedSurveySummary
{
    public List<Models.SurveySummary> Surveys { get; set; } = new();
    public int TotalCount { get; set; }
    
    public int? StudyTotalCount { get; set; } 
}
