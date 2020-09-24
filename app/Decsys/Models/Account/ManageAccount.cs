using System.ComponentModel.DataAnnotations;

namespace Decsys.Models.Account
{
    public record EditProfileModel([Required] string FullName);

    public record RequestEmailChangeModel(
        [Required]
        [EmailAddress]
        string Email,
        [Required]
        [EmailAddress]
        string EmailConfirm);
}
