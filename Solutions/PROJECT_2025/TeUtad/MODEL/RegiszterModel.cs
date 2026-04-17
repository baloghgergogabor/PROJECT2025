using System.ComponentModel.DataAnnotations;

namespace TeUtad.MODEL
{
    public class RegiszterModel
    {
        [Required]
        [MinLength(3, ErrorMessage = "A névnek legalább 3 karakter hosszúnak kell lennie")]
        public string FullName { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Érvényes e-mail címet adj meg")]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "A jelszónak legalább 8 karakter hosszúnak kell lennie")]
        public string Password { get; set; }

        [Required]
        [Compare(nameof(Password), ErrorMessage = "A jelszavak nem egyeznek")]
        public string ConfirmPassword { get; set; }

    }
}
