using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class VarosSzerviz(HttpClient _http)
    {
        public async Task<List<Varos>> GetAllVaros() => await _http.GetFromJsonAsync<List<Varos>>("api/Varos");
        public async Task<Varos> GetByIdVaros(int id) => await _http.GetFromJsonAsync<Varos>($"api/Varos/{id}");

        public async Task PostVaros(Varos Varos) => await _http.PostAsJsonAsync("api/Varos", Varos);

        public async Task UpdateVaros(int id, Varos Varos) => await _http.PatchAsJsonAsync($"api/Varos/{id}", Varos);

        public async Task DeleteVaros(int id) => await _http.DeleteFromJsonAsync<Varos>($"api/Varos/{id}");

    }
}
