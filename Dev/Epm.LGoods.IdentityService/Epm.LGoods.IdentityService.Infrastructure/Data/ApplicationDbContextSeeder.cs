using Epm.LGoods.IdentityService.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Epm.LGoods.IdentityService.Infrastructure.Data
{
    public static class ApplicationDbContextSeeder
    {
        public static void SeedData(this ApplicationDbContext context)
        {
            SeedUsers(context);
            SeedVendorDetails(context);
        }

        public static void SeedUsers(ApplicationDbContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.AddRange(new[]
                {
                    new User { FirstName = "Amit", LastName = "Sharma", Email = "amitsharma@example.com", Password = "Amitsha@123", MobileNumber = "9123456789", AccountType = "Admin" },
                    new User { FirstName = "Priya", LastName = "Rao", Email = "priyarao@example.com", Password = "Priya@123", MobileNumber = "9987654321", AccountType = "Vendor" },
                    new User { FirstName = "Vikram", LastName = "Singh", Email = "vikramsingh@example.com", Password = "Vikram@123", MobileNumber = "9876543210", AccountType = "Admin" },
                    new User { FirstName = "Anita", LastName = "Mehta", Email = "sagarrevankar82@gmail.com", Password = "Anita@123", MobileNumber = "9765432109", AccountType = "Vendor" },
                    new User { FirstName = "Rohit", LastName = "Verma", Email = "darshanpatil002244@gmail.com", Password = "Rohit@123", MobileNumber = "9988776655", AccountType = "Vendor" },
                    new User { FirstName = "Sonia", LastName = "Kapoor", Email = "sagarvrevankar2001@gmail.com", Password = "Sonia@123", MobileNumber = "8899665544", AccountType = "Vendor" }
                });

                context.SaveChanges();
            }
        }

        public static void SeedVendorDetails(ApplicationDbContext context)
        {
            if (!context.VendorDetails.Any())
            {
                context.VendorDetails.AddRange(new[]
                {
                    new VendorDetails { BusinessName = "Vendor Co.", City = "Hyderabad", State = "Telegana", Zipcode = "500001", Status = "Pending", RegistrationDate = DateTime.UtcNow, UserId = 2},
                    new VendorDetails { BusinessName = "Best Deals", City = "Bangalore", State = "Karnataka", Zipcode = "560001", Status = "Pending", RegistrationDate = DateTime.UtcNow, UserId = 4},
                    new VendorDetails { BusinessName = "Fresh Goods", City = "Chennai", State = "Tamil Nadu", Zipcode = "600001", Status = "Pending", RegistrationDate = DateTime.UtcNow, UserId = 5},
                    new VendorDetails { BusinessName = "Quality Mart", City = "Mumbai", State = "Maharashtra", Zipcode = "400001", Status = "Pending", RegistrationDate = DateTime.UtcNow, UserId = 6}    
                });

                context.SaveChanges();
            }
        }
    }
}
