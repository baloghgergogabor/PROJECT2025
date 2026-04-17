using static System.Net.WebRequestMethods;
using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class RepuloJegySzerviz(HttpClient _http)
    {
        public async Task<List<RepuloJegy>> GetAllRepuloJegy() => await _http.GetFromJsonAsync<List<RepuloJegy>>("api/RepuloJegy");
        public async Task<RepuloJegy> GetByIdRepuloJegy(int id) => await _http.GetFromJsonAsync<RepuloJegy>($"api/RepuloJegy/{id}");

        public async Task PostRepuloJegy(RepuloJegy RepuloJegy) => await _http.PostAsJsonAsync("api/RepuloJegy", RepuloJegy);

        public async Task UpdateRepuloJegy(RepuloJegy RepuloJegy) => await _http.PatchAsJsonAsync($"api/RepuloJegy", RepuloJegy);

        public async Task DeleteRepuloJegy(int id) => await _http.DeleteAsync($"api/RepuloJegy/{id}");

    }
}
