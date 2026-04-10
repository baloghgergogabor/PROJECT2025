using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class MegaloRend
    {
        [Key]
        public int MegaloRendId { get; set; }
        public int LatvanyosagId { get; set; }
        public int FelhasznaloId { get; set; }
        public int MegaloRendezese {  get; set; }
        public TimeSpan MegalonalTartozkodas { get; set; }
    }
}
