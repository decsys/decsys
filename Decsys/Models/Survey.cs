﻿using System.Collections.Generic;

namespace Decsys.Models
{
    public class Survey
    {
        public Survey(string name)
        {
            Name = name;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Page> Pages { get; set; } = new List<Page>();

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
