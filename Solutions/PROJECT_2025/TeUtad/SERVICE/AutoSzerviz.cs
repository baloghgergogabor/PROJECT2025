using static System.Net.WebRequestMethods;
using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class AutoSzerviz(HttpClient _http)
    {
        public async Task<List<Auto>> GetAllAuto() => await _http.GetFromJsonAsync<List<Auto>>("api/Auto");
        public async Task<Auto> GetByIdAuto(int id) => await _http.GetFromJsonAsync<Auto>($"api/Auto/{id}");

        public async Task PostAuto(Auto Auto) => await _http.PostAsJsonAsync("api/Auto", Auto);

        public async Task UpdateAuto(Auto Auto) => await _http.PatchAsJsonAsync($"api/Auto", Auto);

        public async Task DeleteAuto(int id) => await _http.DeleteAsync($"api/Auto/{id}");

    }
}
