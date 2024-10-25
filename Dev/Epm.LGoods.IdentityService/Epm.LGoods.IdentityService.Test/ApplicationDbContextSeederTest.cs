using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;

namespace Epm.LGoods.IdentityService.Test
{
    [TestClass]
    public class ApplicationDbContextSeederTests
    {
        private ApplicationDbContext _dbContext;

        [TestInitialize]
        public void Initialize()
        {
            // Use in-memory database for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "Test_Database")
                .Options;

            _dbContext = new ApplicationDbContext(options);

            // Ensure the database is created and seeded before each test
            _dbContext.Database.EnsureDeleted(); // Ensure the database is deleted to start fresh
            _dbContext.Database.EnsureCreated(); // Create the in-memory database
        }

        [TestCleanup]
        public void Cleanup()
        {
            _dbContext.Dispose();
        }

        [TestMethod]
        public void ApplicationDbContextSeeder_SeedUsers_ShouldSeedUsers()
        {
            // Act
            ApplicationDbContextSeeder.SeedUsers(_dbContext);

            // Assert
            var usersCount = _dbContext.Users.Count();
            Assert.AreEqual(6, usersCount); // Assert that 6 users are seeded
        }

        [TestMethod]
        public void ApplicationDbContextSeeder_SeedVendorDetails_ShouldSeedVendorDetails()
        {
            // Act
            ApplicationDbContextSeeder.SeedVendorDetails(_dbContext);

            // Assert
            var vendorDetailsCount = _dbContext.VendorDetails.Count();
            Assert.AreEqual(4, vendorDetailsCount); // Assert that 4 vendor details are seeded
        }
    }
}

