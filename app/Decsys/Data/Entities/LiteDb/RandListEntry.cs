using Decsys.Constants;

using LiteDB;

namespace Decsys.Data.Entities.LiteDb
{
    public class RandListEntry : BaseRandListEntry
    {
        [BsonRef(Collections.StudySurveyAllocations)]
        public StudySurveyAllocation? Allocation { get; set; }
    }
}
