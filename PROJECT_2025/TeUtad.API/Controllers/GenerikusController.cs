using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TeUtad.API.INTERFACE;

namespace TeUtad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenerikusController<T> : ControllerBase where T : class
    {
        private readonly IGenerikusInterface<T> _interface;

        public GenerikusController(IGenerikusInterface<T> @interface)
        {
            _interface = @interface;
        }
        [HttpGet]
        public async Task<ActionResult<List<T>>> GetAll() => await _interface.GetMind();

        [HttpGet("{id:int}")]
        public async Task<ActionResult<T>> GetId(int id) => await _interface.GetById(id);

        [HttpPost]
        public async Task<ActionResult> Add(T entity)
        {
            await _interface.Add(entity);
            return Ok();
        }
        [HttpPatch]
        public async Task<ActionResult> Update(T entity)
        {
            await _interface.Update(entity);
            return Ok();
        }
        [HttpDelete]
        public async Task<ActionResult> Torol(int id)
        {
            await _interface.Delete(id);
            return Ok();
        }

    }
}
