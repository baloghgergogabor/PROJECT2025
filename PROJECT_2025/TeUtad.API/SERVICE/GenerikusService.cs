using Microsoft.EntityFrameworkCore;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Data;

namespace TeUtad.API.SERVICE
{
    public class GenerikusService<T> : IGenerikusInterface<T> where T : class
    {
        private readonly UtazasDbContext _Adatbazis;
        private readonly DbSet<T> adatok;

        public GenerikusService(UtazasDbContext adatbazis, DbSet<T> adatok)
        {
            _Adatbazis = adatbazis;
            this.adatok = adatbazis.Set<T>();
        }

        public async Task<List<T>> GetMind() => await adatok.ToListAsync();
        public async Task<T> Add(T entity)
        {
            adatok.Add(entity);
            await _Adatbazis.SaveChangesAsync();
            return entity;
        }
        public async Task<T> GetById(int id) =>
            await adatok.FindAsync(id);

        public async Task Delete(int id)
        {
            var temp = await GetById(id);
            if (temp == null) return;
            adatok.Remove(temp);
            await _Adatbazis.SaveChangesAsync();
        }

        public async Task Update(T entity)
        {
            adatok.Update(entity);
            await _Adatbazis.SaveChangesAsync();
        }
    }
}
