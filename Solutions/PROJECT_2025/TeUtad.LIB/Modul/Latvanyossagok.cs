using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class Latvanyossagok
    {
        [Key]
        public int id { get; set; }
        public string Latvanyossag {  get; set; }
        public bool UNESCO {  get; set; }
        public string GoogleMapsId { get; set; }
        public string Cim { get; set; }
    }
}
