using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Modul;

namespace TeUtad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LatvanyossagokController : GenerikusController<Latvanyossagok>
    {
        public LatvanyossagokController(IGenerikusInterface<Latvanyossagok> @interface) : base(@interface)
        {
        }
    }
}
