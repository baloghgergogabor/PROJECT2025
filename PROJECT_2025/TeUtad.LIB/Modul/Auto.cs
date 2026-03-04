using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class Auto
    {
        [Key]
        public int id {  get; set; }
        public string AutoNev { get; set; }
        public int Ar {  get; set; }
        public int VarosId { get; set; }
        public bool Elerhetoseg {  get; set; }
    }
}
