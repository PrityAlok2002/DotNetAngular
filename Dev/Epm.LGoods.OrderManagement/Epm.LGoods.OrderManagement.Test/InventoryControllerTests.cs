using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.API.Controllers;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class InventoryControllerTests
    {
        private Mock<IInventoryService> _mockInventoryService;
        private InventoryController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockInventoryService = new Mock<IInventoryService>();
            _controller = new InventoryController(_mockInventoryService.Object);
        }

        [TestMethod]
        public async Task GetById_ReturnsNotFound_WhenInventoryDoesNotExist()
        {
            // Arrange
            int testId = 1;
            _mockInventoryService.Setup(service => service.GetByIdAsync(testId)).ReturnsAsync((Inventory)null);

            // Act
            var result = await _controller.GetById(testId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetById_ReturnsOk_WithInventory_WhenInventoryExists()
        {
            // Arrange
            int testId = 1;
            var inventory = new Inventory { InventoryId = testId };
            _mockInventoryService.Setup(service => service.GetByIdAsync(testId)).ReturnsAsync(inventory);

            // Act
            var result = await _controller.GetById(testId) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.AreEqual(inventory, result.Value);
        }

        [TestMethod]
        public async Task GetAll_ReturnsOk_WithInventories()
        {
            // Arrange
            var inventories = new[] { new Inventory(), new Inventory() };
            _mockInventoryService.Setup(service => service.GetAllAsync()).ReturnsAsync(inventories);

            // Act
            var result = await _controller.GetAll() as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            CollectionAssert.AreEqual(inventories, result.Value as Inventory[]);
        }

        [TestMethod]
        public async Task Create_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            var inventory = new Inventory();
            _controller.ModelState.AddModelError("Error", "Invalid model");

            // Act
            var result = await _controller.Create(inventory);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }

        [TestMethod]
        public async Task Create_ReturnsCreatedAtAction_WhenModelIsValid()
        {
            // Arrange
            var inventory = new Inventory { InventoryId = 1 };
            _mockInventoryService.Setup(service => service.AddAsync(inventory)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Create(inventory) as CreatedAtActionResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(201, result.StatusCode);
            Assert.AreEqual("GetById", result.ActionName);
            Assert.AreEqual(inventory, result.Value);
        }

        [TestMethod]
        public async Task Delete_ReturnsNotFound_WhenInventoryDoesNotExist()
        {
            // Arrange
            int testId = 1;
            _mockInventoryService.Setup(service => service.GetByIdAsync(testId)).ReturnsAsync((Inventory)null);

            // Act
            var result = await _controller.Delete(testId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task Delete_ReturnsNoContent_WhenInventoryExists()
        {
            // Arrange
            int testId = 1;
            var inventory = new Inventory { InventoryId = testId };
            _mockInventoryService.Setup(service => service.GetByIdAsync(testId)).ReturnsAsync(inventory);
            _mockInventoryService.Setup(service => service.DeleteAsync(testId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(testId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }
    }
}
