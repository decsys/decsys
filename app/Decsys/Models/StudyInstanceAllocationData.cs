using System;
using System.Collections.Generic;

namespace Decsys.Models
{
    /// <summary>
    /// Export model for Study Instances
    /// </summary>
    public class StudyInstanceAllocationData : BaseSurveyInstanceResults
    {
        public List<StudySurveyAllocation> Allocations { get; set; } = new();

        public List<RandListEntry> RandList { get; set; } = new();
    }

    /// <summary>
    /// Export model for Study Survey Allocation records
    /// </summary>
    public class StudySurveyAllocation
    {
        public int Id { get; set; }

        public string ParticipantId { get; set; } = string.Empty;

        public int InstanceId { get; set; }

        public DateTimeOffset Allocated { get; set; } = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Export model for a Study Instance's Blocked Randomisation List
    /// </summary>
    public class RandListEntry
    {
        public int Id { get; set; }

        public int Block { get; set; }

        public int InstanceId { get; set; }

        public int? AllocationId { get; set; }
    }
}
