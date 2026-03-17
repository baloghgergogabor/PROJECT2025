using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeUtad.API.INTERFACE;
using TeUtad.LIB.Modul;

namespace TeUtad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutoController : GenerikusController<Auto>
    {
        public AutoController(IGenerikusInterface<Auto> @interface) : base(@interface)
        {
        }
    }
}
