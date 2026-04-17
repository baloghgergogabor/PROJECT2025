using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class UtazasLatvanyossagSzerviz(HttpClient _http)
    {
        public async Task<List<UtazasLatvanyossag>> GetAllUtazasLatvanyossag() => 
            await _http.GetFromJsonAsync<List<UtazasLatvanyossag>>("api/UtazasLatvanyossag");

        public async Task<UtazasLatvanyossag?> GetByIdUtazasLatvanyossag(int id) => 
            await _http.GetFromJsonAsync<UtazasLatvanyossag>($"api/UtazasLatvanyossag/{id}");

        public async Task PostUtazasLatvanyossag(UtazasLatvanyossag utazasLatvanyossag) => 
            await _http.PostAsJsonAsync("api/UtazasLatvanyossag", utazasLatvanyossag);

        public async Task UpdateUtazasLatvanyossag(UtazasLatvanyossag utazasLatvanyossag) => 
            await _http.PatchAsJsonAsync("api/UtazasLatvanyossag", utazasLatvanyossag);

        public async Task DeleteUtazasLatvanyossag(int id) => 
            await _http.DeleteAsync($"api/UtazasLatvanyossag/{id}");
    }
}
