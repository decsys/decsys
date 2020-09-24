using System.ComponentModel.DataAnnotations;

namespace Decsys.Models.Account
{
    public record PasswordResetModel(
            [Required]
            [DataType(DataType.Password)]
            string Password,
            [Required]
            [DataType(DataType.Password)]
            string PasswordConfirm);

    public record RequestPasswordResetModel(
            [Required]
            [EmailAddress]
            string Email);

    public record ChangePasswordModel(
            [Required]
            [DataType(DataType.Password)]
            string CurrentPassword,
            string Password,
            string PasswordConfirm
            ) : PasswordResetModel(Password, PasswordConfirm);
}
