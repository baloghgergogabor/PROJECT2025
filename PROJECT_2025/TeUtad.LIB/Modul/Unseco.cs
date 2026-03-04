using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class Unseco
    {
        [Key]
        public int id { get; set; }

        public int VarosId { get; set; }
        public string UNESCO
    }
}
