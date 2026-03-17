using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Modul;

namespace TeUtad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VarosController : GenerikusController<Varos>
    {
        public VarosController(IGenerikusInterface<Varos> service) : base(service)
        {
        }
    }
}
