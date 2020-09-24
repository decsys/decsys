using System.ComponentModel.DataAnnotations;

namespace Decsys.Models.Account
{
    public record EditProfileModel([Required] string FullName);
}
