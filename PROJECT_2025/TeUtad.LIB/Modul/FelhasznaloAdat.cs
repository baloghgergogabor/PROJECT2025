using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class FelhasznaloAdat
    {
        [Key]
        public int id { get; set; }
        public string FelhasznaloNev { get; set; }
        public string JelszoHash { get; set; }
        public string Email { get; set; }
    }
}
