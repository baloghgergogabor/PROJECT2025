using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class Varos
    {
        [Key]
        public int id { get; set; }
        public string VarosNev { get; set; }
        public string Leiras { get; set; }
    }
}
