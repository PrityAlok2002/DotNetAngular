using System;
using System.Linq;
using Epm.LGoods.IdentityService.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Epm.LGoods.IdentityService.Test
{
    [TestClass]
    public class ApplicationDbContextTests
    {
        private ApplicationDbContext _dbContext;
        private DbContextOptions<ApplicationDbContext> _options;

        [TestInitialize]
        public void Initialize()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _dbContext = new ApplicationDbContext(_options);
            SeedData();
        }

        private void SeedData()
        {
            // Seed some test data if needed
            var user = new User
            {
                UserId = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "Password123",
                MobileNumber = "1234567890",
                AccountType = "Admin"
            };

            var vendorDetails = new VendorDetails
            {
                VendorId = 1,
                BusinessName = "Sample Business",
                City = "Sample City",
                State = "Sample State",
                Zipcode = "123456",
                Status = "Pending",
                RegistrationDate = DateTime.UtcNow,
                UserId = user.UserId,
                User = user  // Link to the user
            };

            _dbContext.Users.Add(user);
            _dbContext.VendorDetails.Add(vendorDetails);
            _dbContext.SaveChanges();
        }

        [TestMethod]
        public void DbContext_ShouldLoadUsers()
        {
            var users = _dbContext.Users.ToList();

            Assert.AreEqual(1, users.Count);
            Assert.AreEqual("John", users[0].FirstName);
        }



        [TestMethod]
        public void DbContext_ShouldLoadVendorDetails()
        {
            // Act
            var vendorDetails = _dbContext.VendorDetails.ToList();

            // Assert
            Assert.AreEqual(1, vendorDetails.Count);
            Assert.AreEqual("Sample Business", vendorDetails[0].BusinessName);
            // Add more assertions as needed
        }

        [TestMethod]
        public void DbContext_ShouldApplyDefaultValues()
        {
            // Act
            var vendorDetails = _dbContext.VendorDetails.FirstOrDefault();

            // Assert
            Assert.IsNotNull(vendorDetails);
            Assert.AreEqual("Pending", vendorDetails.Status);
            // Add more assertions for other default values if applicable
        }


        [TestCleanup]
        public void Cleanup()
        {
            _dbContext.Database.EnsureDeleted(); // Ensure the in-memory database is deleted after each test
            _dbContext.Dispose();
        }
    }
}
