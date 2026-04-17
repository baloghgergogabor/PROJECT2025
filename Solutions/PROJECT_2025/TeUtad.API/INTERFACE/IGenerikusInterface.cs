namespace TeUtad.API.INTERFACE
{
    public interface IGenerikusInterface<T> where T : class
    {
        public Task<List<T>> GetMind();
        public Task<T> GetById(int id);
        public Task<T> Add(T entity);
        public Task Update(T entity);
        public Task Delete(int id);

    }
}
