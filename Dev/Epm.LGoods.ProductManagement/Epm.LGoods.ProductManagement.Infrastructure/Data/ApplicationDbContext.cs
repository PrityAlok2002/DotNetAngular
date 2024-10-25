using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Price> Prices { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }


        public DbSet<Tag> Tags { get; set; }

        public DbSet<ProductImage> ProductImages { get; set; }

        public DbSet<ProductTag> ProductTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            //protected override void OnModelCreating(ModelBuilder modelBuilder)
            //{

            //    base.OnModelCreating(modelBuilder);
            //    modelBuilder.Entity<Product>().ToTable("Products");
            //    modelBuilder.Entity<Tag>().ToTable("Tags");

            //}
        }
    }
}