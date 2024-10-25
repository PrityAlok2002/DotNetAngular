using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class ManufacturerListServiceTest
    {
        private Mock<IManufacturerRepositoryList> _mockManufacturerRepository;
        private ManufacturerListService _manufacturerService;

        [TestInitialize]
        public void Setup()
        {
            _mockManufacturerRepository = new Mock<IManufacturerRepositoryList>();
            _manufacturerService = new ManufacturerListService(_mockManufacturerRepository.Object);
        }

        [TestMethod]
        public async Task GetAllManufacturersAsync_ReturnsListOfManufacturerDtos()
        {
            // Arrange
            var manufacturers = new List<ManufacturerDetails>
            {
                new ManufacturerDetails() { ManufacturerId = 1, ManufacturerName = "Manufacturer1", Published = true, DisplayOrder = 1, LimitedToVendors = "Vendor1", CreatedOn = DateTime.UtcNow },
                new ManufacturerDetails() { ManufacturerId = 2, ManufacturerName = "Manufacturer2", Published = true, DisplayOrder = 2, LimitedToVendors = "Vendor2", CreatedOn = DateTime.UtcNow }
            };
            _mockManufacturerRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(manufacturers);

            // Act
            var result = await _manufacturerService.GetAllManufacturersAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual("Manufacturer1", result.First().ManufacturerName);
        }

        [TestMethod]
        public async Task GetManufacturerByIdAsync_ReturnsManufacturerDto()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails() { ManufacturerId = 1, ManufacturerName = "Manufacturer1", Published = true, DisplayOrder = 1, LimitedToVendors = "Vendor1", CreatedOn = DateTime.UtcNow };
            _mockManufacturerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(manufacturer);

            // Act
            var result = await _manufacturerService.GetManufacturerByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Manufacturer1", result.ManufacturerName);
        }

        [TestMethod]
        public async Task GetManufacturerByIdAsync_ReturnsNull_WhenManufacturerNotFound()
        {
            // Arrange
            _mockManufacturerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync((ManufacturerDetails)null);

            // Act
            var result = await _manufacturerService.GetManufacturerByIdAsync(1);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task UpdateManufacturerAsync_ReturnsUpdatedManufacturerDto()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails() { ManufacturerId = 1, ManufacturerName = "OldName", Published = true, DisplayOrder = 1, LimitedToVendors = "OldVendor", CreatedOn = DateTime.UtcNow };
            var manufacturerDto = new ManufacturerListDto { ManufacturerId = 1, ManufacturerName = "NewName", Published = true, DisplayOrder = 1, LimitedToVendors = "NewVendor", CreatedOn = DateTime.UtcNow };

            _mockManufacturerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(manufacturer);
            _mockManufacturerRepository.Setup(repo => repo.UpdateAsync(It.IsAny<ManufacturerDetails>())).Returns(Task.CompletedTask);

            // Act
            var result = await _manufacturerService.UpdateManufacturerAsync(1, manufacturerDto);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("NewName", result.ManufacturerName);
        }

        [TestMethod]
        public async Task UpdateManufacturerAsync_ReturnsNull_WhenManufacturerNotFound()
        {
            // Arrange
            var manufacturerDto = new ManufacturerListDto { ManufacturerId = 1, ManufacturerName = "NewName", Published = true, DisplayOrder = 1, LimitedToVendors = "NewVendor", CreatedOn = DateTime.UtcNow };

            _mockManufacturerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync((ManufacturerDetails)null);

            // Act
            var result = await _manufacturerService.UpdateManufacturerAsync(1, manufacturerDto);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task DeleteManufacturerAsync_ReturnsTrue_WhenManufacturerDeleted()
        {
            // Arrange
            var manufacturer = new ManufacturerDetails() { ManufacturerId = 1, ManufacturerName = "Manufacturer1", Published = true, DisplayOrder = 1, LimitedToVendors = "Vendor1", CreatedOn = DateTime.UtcNow };

            _mockManufacturerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(manufacturer);
            _mockManufacturerRepository.Setup(repo => repo.DeleteAsync(It.IsAny<ManufacturerDetails>())).Returns(Task.CompletedTask);

            // Act
            var result = await _manufacturerService.DeleteManufacturerAsync(1);

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public async Task DeleteManufacturerAsync_ReturnsFalse_WhenManufacturerNotFound()
        {
            // Arrange
            _mockManufacturerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync((ManufacturerDetails)null);

            // Act
            var result = await _manufacturerService.DeleteManufacturerAsync(1);

            // Assert
            Assert.IsFalse(result);
        }
    }
}
