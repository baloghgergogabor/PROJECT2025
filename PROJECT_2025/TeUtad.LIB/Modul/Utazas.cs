using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class Utazas
    {
        [Key]
        public int id { get; set; }
        public int VarosId { get; set; }
        public int HotelId { get; set; }
        public int FelhasznaloId { get; set; }
        public int AutoId { get; set; }
        public int RepuloJegyId {  get; set; }
        public DateOnly UtazasKezdes { get; set; }
    }
}
