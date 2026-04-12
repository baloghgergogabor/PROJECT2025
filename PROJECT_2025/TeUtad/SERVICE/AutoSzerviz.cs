using static System.Net.WebRequestMethods;
using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class AutoSzerviz(HttpClient _http)
    {
        public async Task<List<Auto>> GetAllAuto() => await _http.GetFromJsonAsync<List<Auto>>("api/Felhasznalo");
        public async Task<Auto> GetByIdAuto(int id) => await _http.GetFromJsonAsync<Auto>($"api/Felhasznalo/{id}");

        public async Task PostAuto(Auto Auto) => await _http.PostAsJsonAsync("api/Felhasznalo", Auto);

        public async Task UpdateAuto(Auto Auto) => await _http.PatchAsJsonAsync($"api/Felhasznalo", Auto);

        public async Task DeleteAuto(int id) => await _http.DeleteFromJsonAsync<Auto>($"api/Felhasznalo/{id}");

    }
}
