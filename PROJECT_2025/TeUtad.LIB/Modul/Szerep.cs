using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class Szerep
    {
        [Key]
        public int SzerepId { get; set; }
        public int FelhasznaloId { get; set; }
        public string Szerepe { get; set; }
    }
}
