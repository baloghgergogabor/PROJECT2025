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

    }
}
