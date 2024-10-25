using Epm.LGoods.OrderManagement.API.Controllers;
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class ManufacturersControllerListTest
    {
        private Mock<IManufacturerListService> _mockManufacturerService;
        private ManufacturersListController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockManufacturerService = new Mock<IManufacturerListService>();
            _controller = new ManufacturersListController(_mockManufacturerService.Object);
        }

        [TestMethod]
        public async Task GetAllManufacturers_ReturnsOkResult_WithListOfManufacturers()
        {
            // Arrange
            var manufacturers = new List<ManufacturerListDto>
            {
                new ManufacturerListDto { ManufacturerId = 1, ManufacturerName = "Manufacturer1" },
                new ManufacturerListDto { ManufacturerId = 2, ManufacturerName = "Manufacturer2" }
            };
            _mockManufacturerService.Setup(service => service.GetAllManufacturersAsync()).ReturnsAsync(manufacturers);

            // Act
            var result = await _controller.GetAllManufacturers();
            var okResult = result.Result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsInstanceOfType(okResult.Value, typeof(IEnumerable<ManufacturerListDto>));
        }

        [TestMethod]
        public async Task GetManufacturerById_ReturnsOkResult_WithManufacturer()
        {
            // Arrange
            var manufacturer = new ManufacturerListDto { ManufacturerId = 1, ManufacturerName = "Manufacturer1" };
            _mockManufacturerService.Setup(service => service.GetManufacturerByIdAsync(1)).ReturnsAsync(manufacturer);

            // Act
            var result = await _controller.GetManufacturerById(1);
            var okResult = result.Result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsInstanceOfType(okResult.Value, typeof(ManufacturerListDto));
        }

        [TestMethod]
        public async Task GetManufacturerById_ReturnsNotFoundResult()
        {
            // Arrange
            _mockManufacturerService.Setup(service => service.GetManufacturerByIdAsync(1)).ReturnsAsync((ManufacturerListDto)null);

            // Act
            var result = await _controller.GetManufacturerById(1);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task UpdateManufacturer_ReturnsOkResult_WithUpdatedManufacturer()
        {
            // Arrange
            var manufacturerDto = new ManufacturerListDto { ManufacturerId = 1, ManufacturerName = "UpdatedManufacturer" };
            _mockManufacturerService.Setup(service => service.UpdateManufacturerAsync(1, manufacturerDto)).ReturnsAsync(manufacturerDto);

            // Act
            var result = await _controller.UpdateManufacturer(1, manufacturerDto);
            var okResult = result.Result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsInstanceOfType(okResult.Value, typeof(ManufacturerListDto));
        }

        [TestMethod]
        public async Task UpdateManufacturer_ReturnsNotFoundResult()
        {
            // Arrange
            var manufacturerDto = new ManufacturerListDto { ManufacturerId = 1, ManufacturerName = "UpdatedManufacturer" };
            _mockManufacturerService.Setup(service => service.UpdateManufacturerAsync(1, manufacturerDto)).ReturnsAsync((ManufacturerListDto)null);

            // Act
            var result = await _controller.UpdateManufacturer(1, manufacturerDto);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task DeleteManufacturer_ReturnsOkResult_WithTrue()
        {
            // Arrange
            _mockManufacturerService.Setup(service => service.DeleteManufacturerAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteManufacturer(1);
            var okResult = result.Result as OkObjectResult;

            // Assert
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsTrue((bool)okResult.Value);
        }

        [TestMethod]
        public async Task DeleteManufacturer_ReturnsNotFoundResult()
        {
            // Arrange
            _mockManufacturerService.Setup(service => service.DeleteManufacturerAsync(1)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteManufacturer(1);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }
    }
}
