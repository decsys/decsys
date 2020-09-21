using System;
using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;

namespace Decsys.Data.Entities
{
    public class DecsysUser : MongoUser
    {
        [PersonalData]
        public string Fullname { get; set; } = string.Empty;

        public DateTimeOffset? ApprovalDate { get; set; }

        public DateTimeOffset? RejectionDate { get; set; }
    }
}
