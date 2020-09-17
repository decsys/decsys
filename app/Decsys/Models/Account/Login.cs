using System.ComponentModel.DataAnnotations;

namespace Decsys.Models.Account
{
    public class Login
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public string Button { get; set; } = string.Empty;

        public string? ReturnUrl { get; set; }

    }
}
