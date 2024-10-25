using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;


namespace Epm.LGoods.OrderManagement.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<ManufacturerDetails> Manufacturers { get; set; }
        public DbSet<VendorDetails> Vendor { get; set; }

        public DbSet<Inventory> Inventories { get; set; }

        //public DbSet<ProductTag> ProductTags { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{

        //    base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<ManufacturerDetails>()
        //          .HasOne(m => m.Vendor) // Assuming ManufacturerDetails has a Vendor property
        //          .WithMany() // If Vendor has a collection of Manufacturers, otherwise use .WithOne()
        //          .HasForeignKey(m => m.VendorId)
        //          .OnDelete(DeleteBehavior.Restrict);

        //    // Ignore the existing tables
        //    //modelBuilder.Ignore<VendorDetails>();

        //}

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

    }
}
