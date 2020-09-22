using System;
using System.Linq;

namespace Decsys.Models.Results
{
    public enum SurveyAccessStatus
    {
        NotFound,
        AccessDenied,
        Owned,
        Shared
    }

    public record SurveyAccessResult(SurveyAccessStatus status)
    {
        public bool IsAccessible() =>
            new[] { SurveyAccessStatus.Owned, SurveyAccessStatus.Shared }
            .Contains(status);
    }
}
