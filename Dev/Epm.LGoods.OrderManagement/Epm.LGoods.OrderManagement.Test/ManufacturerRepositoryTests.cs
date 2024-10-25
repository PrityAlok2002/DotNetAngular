
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Tests
{
    [TestClass]
    public class ManufacturerRepositoryTests
    {
        private ApplicationDbContext _context;
        private ManufacturerRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            // Use In-Memory Database for testing
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new ManufacturerRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        private ManufacturerDetails CreateManufacturer(int id, string name, string description, bool limitedToVendors)
        {
            return new ManufacturerDetails
            {
                ManufacturerId = id,
                ManufacturerName = name,
                Description = description,
                LimitedToVendors = "limitedToVendors"
            };
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnManufacturer_WhenManufacturerExists()
        {
            // Arrange
            var manufacturer = CreateManufacturer(1, "Test Manufacturer", "Test Description", false);
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(manufacturer.ManufacturerId, result.ManufacturerId);
            Assert.AreEqual(manufacturer.ManufacturerName, result.ManufacturerName);
            Assert.AreEqual(manufacturer.Description, result.Description);
            Assert.AreEqual(manufacturer.LimitedToVendors, result.LimitedToVendors);
        }

        [TestMethod]
        public async Task GetByIdAsync_ShouldReturnNull_WhenManufacturerDoesNotExist()
        {
            // Act
            var result = await _repository.GetByIdAsync(1);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task GetAllAsync_ShouldReturnAllManufacturers()
        {
            // Arrange
            var manufacturers = new List<ManufacturerDetails>
            {
                CreateManufacturer(1, "Test Manufacturer 1", "Test Description 1", false),
                CreateManufacturer(2, "Test Manufacturer 2", "Test Description 2", false)
            };
            _context.Manufacturers.AddRange(manufacturers);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual(manufacturers[0].ManufacturerId, result.First().ManufacturerId);
            Assert.AreEqual(manufacturers[1].ManufacturerId, result.Last().ManufacturerId);
        }

        [TestMethod]
        public async Task AddAsync_ShouldAddManufacturer()
        {
            // Arrange
            var manufacturer = CreateManufacturer(1, "Test Manufacturer", "Test Description", false);

            // Act
            await _repository.AddAsync(manufacturer);

            // Assert
            var addedManufacturer = await _context.Manufacturers.FindAsync(1);
            Assert.IsNotNull(addedManufacturer);
            Assert.AreEqual(manufacturer.ManufacturerName, addedManufacturer.ManufacturerName);
            Assert.AreEqual(manufacturer.Description, addedManufacturer.Description);
            Assert.AreEqual(manufacturer.LimitedToVendors, addedManufacturer.LimitedToVendors);
        }

        [TestMethod]
        public async Task UpdateAsync_ShouldUpdateManufacturer()
        {
            // Arrange
            var manufacturer = CreateManufacturer(1, "Test Manufacturer", "Test Description", false);
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();

            // Act
            manufacturer.ManufacturerName = "Updated Manufacturer";
            manufacturer.Description = "Updated Description";
            await _repository.UpdateAsync(manufacturer);

            // Assert
            var updatedManufacturer = await _context.Manufacturers.FindAsync(1);
            Assert.IsNotNull(updatedManufacturer);
            Assert.AreEqual("Updated Manufacturer", updatedManufacturer.ManufacturerName);
            Assert.AreEqual("Updated Description", updatedManufacturer.Description);
        }

        [TestMethod]
        public async Task DeleteAsync_ShouldRemoveManufacturer_WhenManufacturerExists()
        {
            // Arrange
            var manufacturer = CreateManufacturer(1, "Test Manufacturer", "Test Description", false);
            _context.Manufacturers.Add(manufacturer);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAsync(1);

            // Assert
            var deletedManufacturer = await _context.Manufacturers.FindAsync(1);
            Assert.IsNull(deletedManufacturer);
        }

        [TestMethod]
        public async Task DeleteAsync_ShouldNotRemoveManufacturer_WhenManufacturerDoesNotExist()
        {
            // Act
            await _repository.DeleteAsync(1);

            // Assert
            var remainingManufacturers = await _context.Manufacturers.ToListAsync();
            Assert.AreEqual(0, remainingManufacturers.Count);
        }
    }
}