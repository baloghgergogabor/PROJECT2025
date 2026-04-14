using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class UtazasLatvanyossag
    {
        [Key]
        public int Id { get; set; }
        public int UtazasId { get; set; }
        public int LatvanyossagId { get; set; }
        public int Sorrend { get; set; } // Order of the attraction in the trip
        public int TartozkodasIdoOra { get; set; } // Duration in hours at this attraction
        public DateTime LatogatasDatum { get; set; } // Visit date
        public TimeSpan KezdesIdo { get; set; } // Start time at this attraction
        public TimeSpan BefejezesIdo { get; set; } // End time at this attraction
        public string UtazasiModKovetkezohoz { get; set; } = "WALKING"; // Travel mode to next location (DRIVING, WALKING, BICYCLING, TRANSIT)
    }
}
