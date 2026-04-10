using TeUtad.LIB.Modul;
using static System.Net.WebRequestMethods;

namespace TeUtad.SERVICE
{
    public class FelhasznaloSzerviz(HttpClient _http)
    {
        public async Task<List<FelhasznaloAdat>> GetAllFelhasznalo() => await _http.GetFromJsonAsync<List<FelhasznaloAdat>>("api/Felhasznalo");
        public async Task<FelhasznaloAdat> GetByIdFelhasznalo(int id) => await _http.GetFromJsonAsync<FelhasznaloAdat>($"api/Felhasznalo/{id}");
        public async Task PostFelhasznalo(FelhasznaloAdat felhasznalo) => await _http.PostAsJsonAsync("api/Felhasznalo", felhasznalo);
        public async Task UpdateFelhasznalo(int id,FelhasznaloAdat felhasznalo) => await _http.PatchAsJsonAsync($"api/Felhasznalo/{id}", felhasznalo);
        public async Task DeleteFelhasznalo(int id) => await _http.DeleteFromJsonAsync<FelhasznaloAdat>($"api/Felhasznalo/{id}");
    }
}
