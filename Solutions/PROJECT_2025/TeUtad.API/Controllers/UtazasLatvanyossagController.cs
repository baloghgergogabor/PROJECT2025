using Microsoft.AspNetCore.Mvc;
using TeUtad.API.Controllers;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Modul;

namespace TeUtad.API.CONTROLLER
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtazasLatvanyossagController : GenerikusController<UtazasLatvanyossag>
    {
        public UtazasLatvanyossagController(IGenerikusInterface<UtazasLatvanyossag> @interface) : base(@interface)
        {
        }
    }
}
