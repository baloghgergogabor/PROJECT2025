using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class LatvanyossagokSzerviz(HttpClient _http)
    {
        public async Task<List<Latvanyossagok>> GetAllLatvanyossagok() => await _http.GetFromJsonAsync<List<Latvanyossagok>>("api/Latvanyossagok");
        public async Task<Latvanyossagok> GetByIdLatvanyossagok(int id) => await _http.GetFromJsonAsync<Latvanyossagok>($"api/Latvanyossagok/{id}");

        public async Task PostLatvanyossagok(Latvanyossagok Latvanyossagok) => await _http.PostAsJsonAsync("api/Latvanyossagok", Latvanyossagok);

        public async Task UpdateLatvanyossagok(Latvanyossagok Latvanyossagok) => await _http.PatchAsJsonAsync($"api/Latvanyossagok", Latvanyossagok);

        public async Task DeleteLatvanyossagok(int id) => await _http.DeleteFromJsonAsync<Latvanyossagok>($"api/Latvanyossagok/{id}");

    }
}
