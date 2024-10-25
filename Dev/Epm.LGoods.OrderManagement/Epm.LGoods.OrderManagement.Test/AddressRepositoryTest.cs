using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{

    [TestClass]
    public class AddressRepositoryTests
    {
        private ApplicationDbContext _context;
        private AddressRepository _addressRepository;

        [TestInitialize]
        public void Setup()
        {
            // Create an in-memory database context
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);

            // Ensure database is empty before seeding
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            // Seed the database with test data
            _context.Addresses.Add(new Address
            {
                AddressId = 1,
                HouseNo = "123",
                Building = "Building A",
                Landmark = "Near Park",
                AddressLabel = "Home"
            });
            _context.SaveChanges();

            // Create instance of AddressRepository with in-memory ApplicationDbContext
            _addressRepository = new AddressRepository(_context);
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnAddress_WhenAddressExists()
        {
            // Act
            var result = await _addressRepository.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.AddressId);
            Assert.AreEqual("123", result.HouseNo);
            Assert.AreEqual("Building A", result.Building);
            Assert.AreEqual("Near Park", result.Landmark);
            Assert.AreEqual("Home", result.AddressLabel);
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnNull_WhenAddressDoesNotExist()
        {
            // Act
            var result = await _addressRepository.GetByIdAsync(999);

            // Assert
            Assert.IsNull(result);
        }
    }
}