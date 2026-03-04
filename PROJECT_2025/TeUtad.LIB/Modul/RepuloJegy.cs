using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class RepuloJegy
    {
        [Key]
        public int Id { get; set; }
        public string Tavozas { get; set; }
        public string Erkezes { get; set; }
        public DateTime Datum { get; set; }
        public string LegiTarsasag {  get; set; }
        public int JegySzam {  get; set; }
        public int Ar {  get; set; }
    }
}
