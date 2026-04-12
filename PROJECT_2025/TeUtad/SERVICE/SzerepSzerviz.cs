using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class SzerepSzerviz(HttpClient _http)
    {
        public async Task<List<Szerep>> GetAllSzerep() => await _http.GetFromJsonAsync<List<Szerep>>("api/Szerep");
        public async Task<Szerep> GetByIdSzerep(int id) => await _http.GetFromJsonAsync<Szerep>($"api/Szerep/{id}");

        public async Task PostSzerep(Szerep Szerep) => await _http.PostAsJsonAsync("api/Szerep", Szerep);

        public async Task UpdateSzerep(Szerep Szerep) => await _http.PatchAsJsonAsync($"api/Szerep", Szerep);

        public async Task DeleteSzerep(int id) => await _http.DeleteFromJsonAsync<Szerep>($"api/Szerep/{id}");

    }
}
