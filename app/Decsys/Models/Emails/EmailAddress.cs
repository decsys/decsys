﻿namespace Decsys.Models.Emails
{
    public record EmailAddress(string Address)
    {
        public string? Name { get; init; }
    }
}
