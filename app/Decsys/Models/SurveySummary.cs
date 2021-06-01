﻿namespace Decsys.Models
{
    public class SurveySummary
    {
        public SurveySummary(string name)
        {
            Name = name;
        }

        public string Type { get; set; } = string.Empty;

        public int Id { get; set; }

        public string Name { get; set; }

        public int RunCount { get; set; }

        public int? ActiveInstanceId { get; set; }
    }
}
