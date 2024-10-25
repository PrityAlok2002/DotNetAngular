using Microsoft.VisualStudio.TestTools.UnitTesting;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class ManufacturerListRepositoryTest
    {
        private DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private ApplicationDbContext _context;
        private ManufacturerRepositoryList _repository;

        [TestInitialize]
        public void Setup()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                                .UseInMemoryDatabase(databaseName: "TestDatabase")
                                .Options;

            _context = new ApplicationDbContext(_dbContextOptions);
            _repository = new ManufacturerRepositoryList(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [TestMethod]
        public async Task GetAllAsync_ShouldReturnAllManufacturers()
        {
            // Arrange
            var manufacturers = new List<ManufacturerDetails>
            {
                new ManufacturerDetails { ManufacturerName = "Manufacturer1", Description = "Desc1", LimitedToVendors = "Vendor1" },
                new ManufacturerDetails { ManufacturerName = "Manufacturer2", Description = "Desc2", LimitedToVendors = "Vendor2" }
            };
            _context.Manufacturers.AddRange(manufacturers);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnManufacturerById()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails { ManufacturerName = "Manufacturer1", Description = "Desc1", LimitedToVendors = "Vendor1" };
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(manufacturer.ManufacturerId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(manufacturer.ManufacturerName, result.ManufacturerName);
        }

        [TestMethod]
        public async Task AddAsync_ShouldAddNewManufacturer()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails { ManufacturerName = "New Manufacturer", Description = "New Desc", LimitedToVendors = "Vendor1"};

            // Act
            var result = await _repository.AddAsync(manufacturer);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(manufacturer.ManufacturerName, result.ManufacturerName);
            Assert.AreEqual(1, _context.Manufacturers.Count());
        }

        [TestMethod]
        public async Task UpdateAsync_ShouldUpdateManufacturer()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails { ManufacturerName = "Old Manufacturer", Description = "Old Desc", LimitedToVendors = "Vendor1"};
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();
            manufacturer.ManufacturerName = "Updated Manufacturer";

            // Act
            await _repository.UpdateAsync(manufacturer);
            var updatedManufacturer = await _repository.GetByIdAsync(manufacturer.ManufacturerId);

            // Assert
            Assert.IsNotNull(updatedManufacturer);
            Assert.AreEqual("Updated Manufacturer", updatedManufacturer.ManufacturerName);
        }

        [TestMethod]
        public async Task DeleteAsync_ShouldRemoveManufacturer()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails { ManufacturerName = "Manufacturer to be deleted", Description = "Desc to be deleted", LimitedToVendors = "Vendor1"};
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAsync(manufacturer);

            // Assert
            var deletedManufacturer = await _repository.GetByIdAsync(manufacturer.ManufacturerId);
            Assert.IsNull(deletedManufacturer);
        }
    }
}
