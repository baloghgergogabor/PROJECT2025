using System.ComponentModel.DataAnnotations;

namespace TeUtad.MODEL
{
    public class LoginModel
    {
        [Required(ErrorMessage = "A felhasznaló név megadása kötelező")]
        public string FelhasznaloNev { get; set; } = string.Empty;

        [Required(ErrorMessage = "A jelszó megadása kötelező")]
        [MinLength(6, ErrorMessage = "A jelszónak legalább 6 karakter hosszúnak kell lennie")]
        public string Password { get; set; } = string.Empty;
    }
}
