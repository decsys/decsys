using System.ComponentModel.DataAnnotations;

namespace Decsys.Models.Account
{
    public class Register
    {
        [Required]
        [DataType(DataType.Text)]
        public string Fullname { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string EmailConfirm { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Text)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Text)]
        public string PasswordConfirm { get; set; } = string.Empty;
    }
}
