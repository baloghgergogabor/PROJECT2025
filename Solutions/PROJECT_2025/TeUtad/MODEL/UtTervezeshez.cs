using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeUtad.LIB.Modul
{
    public class UtTervezeshez
    {
        public class Flight
        {
            public int Id { get; set; }
            public string Airline { get; set; } = "";
            public string FlightNumber { get; set; } = "";
            public string DepartureCity { get; set; } = "";
            public string ArrivalCity { get; set; } = "";
            public string DepartureTime { get; set; } = "";
            public string ArrivalTime { get; set; } = "";
            public string Duration { get; set; } = "";
            public int Price { get; set; }
            public string Class { get; set; } = "";
            public bool DirectFlight { get; set; }
            public int Stops { get; set; }
        }

        // === PlaceData osztály a JavaScript callback-hez ===
        public class PlaceData
        {
            public string Name { get; set; } = "";
            public string Address { get; set; } = "";
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public string PlaceId { get; set; } = "";
        }

        // === PlaceDetails osztály nyitvatartási időhöz ===
        public class PlaceDetails
        {
            public string? OpeningHoursText { get; set; }
            public bool? IsOpenNow { get; set; }
            public List<OpeningPeriod>? OpeningPeriods { get; set; }
        }

        public class OpeningPeriod
        {
            public DayTime Open { get; set; } = new();
            public DayTime? Close { get; set; }
        }

        public class DayTime
        {
            public int Day { get; set; }
            public int Hours { get; set; }
            public int Minutes { get; set; }
        }
    }
}
