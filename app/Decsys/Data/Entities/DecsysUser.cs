using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;

namespace Decsys.Data.Entities
{
    public class DecsysUser : MongoUser
    {
        [PersonalData]
        public string Fullname { get; set; } = string.Empty;
    }
}
