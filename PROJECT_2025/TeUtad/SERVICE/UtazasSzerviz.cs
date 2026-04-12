using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class UtazasSzerviz(HttpClient _http)
    {
        public async Task<List<Utazas>> GetAllUtazas() => await _http.GetFromJsonAsync<List<Utazas>>("api/Utazas");
        public async Task<Utazas> GetByIdUtazas(int id) => await _http.GetFromJsonAsync<Utazas>($"api/Utazas/{id}");

        public async Task PostUtazas(Utazas Utazas) => await _http.PostAsJsonAsync("api/Utazas", Utazas);

        public async Task UpdateUtazas(Utazas Utazas) => await _http.PatchAsJsonAsync($"api/Utazas", Utazas);

        public async Task DeleteUtazas(int id) => await _http.DeleteFromJsonAsync<Utazas>($"api/Utazas/{id}");

    }
}
