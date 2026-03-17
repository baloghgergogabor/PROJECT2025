using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Modul;

namespace TeUtad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepuloJegyController : GenerikusController<RepuloJegy>
    {
        public RepuloJegyController(IGenerikusInterface<RepuloJegy> @interface) : base(@interface)
        {
        }
    }
}
