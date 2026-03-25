using TeUtad.LIB.Modul;
using static System.Net.WebRequestMethods;

namespace TeUtad.SERVICE
{
    public class FelhasznaloSzervice(HttpClient _http)
    {
        public async Task<List<FelhasznaloAdat>> GetAllFelhasznalo() => await _http.GetFromJsonAsync<List<FelhasznaloAdat>>("api/Felhasznalo");

        public async Task PostFelhasznalo(FelhasznaloAdat felhasznalo) => await _http.PostAsJsonAsync("/api/Felhasznalo", felhasznalo);

    }
}
