using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Modul;

namespace TeUtad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtazasController : GenerikusController<Utazas>
    {
        public UtazasController(IGenerikusInterface<Utazas> @interface) : base(@interface)
        {
        }
    }
}
