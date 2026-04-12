using static System.Net.WebRequestMethods;
using TeUtad.LIB.Modul;

namespace TeUtad.SERVICE
{
    public class HotelSzerviz(HttpClient _http)
    {
        public async Task<List<Hotel>> GetAllHotel() => await _http.GetFromJsonAsync<List<Hotel>>("api/Hotel");
        public async Task<Hotel> GetByIdHotel(int id) => await _http.GetFromJsonAsync<Hotel>($"api/Hotel/{id}");

        public async Task PostHotel(Hotel Hotel) => await _http.PostAsJsonAsync("api/Hotel", Hotel);

        public async Task UpdateHotel(Hotel Hotel) => await _http.PatchAsJsonAsync($"api/Hotel", Hotel);

        public async Task DeleteHotel(int id) => await _http.DeleteFromJsonAsync<Hotel>($"api/Hotel/{id}");

    }
}
