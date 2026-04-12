using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class MegaloRendSzerviz(HttpClient _http)
    {
        public async Task<List<MegaloRend>> GetAllMegaloRend() => await _http.GetFromJsonAsync<List<MegaloRend>>("api/MegaloRend");
        public async Task<MegaloRend> GetByIdMegaloRend(int id) => await _http.GetFromJsonAsync<MegaloRend>($"api/MegaloRend/{id}");

        public async Task PostMegaloRend(MegaloRend MegaloRend) => await _http.PostAsJsonAsync("api/MegaloRend", MegaloRend);

        public async Task UpdateMegaloRend(MegaloRend MegaloRend) => await _http.PatchAsJsonAsync($"api/MegaloRend", MegaloRend);

        public async Task DeleteMegaloRend(int id) => await _http.DeleteAsync($"api/MegaloRend/{id}");

    }
}
