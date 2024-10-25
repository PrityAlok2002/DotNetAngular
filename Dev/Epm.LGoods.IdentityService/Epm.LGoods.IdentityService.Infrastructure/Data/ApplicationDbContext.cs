using Epm.LGoods.IdentityService.Core.Entities;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<VendorDetails> VendorDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(20);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Password).IsRequired().HasMaxLength(20);
            entity.Property(e => e.MobileNumber).IsRequired().HasMaxLength(10);
            entity.Property(e => e.AccountType).IsRequired();
        });

        modelBuilder.Entity<VendorDetails>(entity =>
        {
            entity.HasKey(e => e.VendorId);
            entity.Property(e => e.BusinessName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.City).IsRequired().HasMaxLength(20);
            entity.Property(e => e.State).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Zipcode).IsRequired().HasMaxLength(6);
            entity.Property(e => e.Status).HasDefaultValue("Pending");
            entity.Property(e => e.RegistrationDate).HasDefaultValueSql("GETDATE()");
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
