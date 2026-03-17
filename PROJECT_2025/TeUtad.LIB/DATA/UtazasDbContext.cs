using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Protocols;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeUtad.LIB.Modul;

namespace TeUtad.LIB.Data
{
    public class UtazasDbContext : DbContext
    {
        public UtazasDbContext(DbContextOptions<UtazasDbContext> options) : base(options)
        {
        }

        protected UtazasDbContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            var konnect = new ConfigurationBuilder()
                                            .SetBasePath(AppContext.BaseDirectory)
                                            .AddJsonFile("KonektcioString.json", optional:false)
                                            .Build();
            optionsBuilder.UseSqlServer(konnect.GetConnectionString("Default"));
        }

        public DbSet<Auto> Auto { get; set; }
        public DbSet<FelhasznaloAdat> FelhasznaloAdat { get; set; }
        public DbSet<Hotel> Hotel { get; set; }
        public DbSet<RepuloJegy> RepuloJegy { get; set; }
        public DbSet<Szerep> Szerep { get; set; }
        public DbSet<Unesco> Unesco { get; set; }
        public DbSet<Utazas> Utazas { get; set; }
        public DbSet<Varos> Varos { get; set; }

    }
}
