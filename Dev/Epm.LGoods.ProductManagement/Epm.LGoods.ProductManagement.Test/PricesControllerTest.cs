using Epm.LGoods.ProductManagement.API.Controllers;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class PricesControllerTest
    {
        private Mock<IPriceService> _priceServiceMock;
        private PricesController _controller;

        [TestInitialize]
        public void Setup()
        {
            _priceServiceMock = new Mock<IPriceService>();
            _controller = new PricesController(_priceServiceMock.Object);
        }

        #region CreatePrice Tests

        [TestMethod]
        public async Task CreatePrice_ValidModel_ReturnsOk()
        {
            // Arrange
            var priceDto = new PriceDto
            {
                Currency = "USD",
                DiscountPercentage = 10,
                EffectivePrice = 90,
                PriceAmount = 100,
                ProductId = 1,
                VendorId = 1
            };

            // Act
            var result = await _controller.CreatePrice(priceDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
        }

        [TestMethod]
        public async Task CreatePrice_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            var priceDto = new PriceDto(); // Invalid model
            _controller.ModelState.AddModelError("Error", "Model is invalid");

            // Act
            var result = await _controller.CreatePrice(priceDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }

        #endregion

        #region GetPriceById Tests

        [TestMethod]
        public async Task GetPriceById_PriceExists_ReturnsOk()
        {
            // Arrange
            var priceDto = new PriceDto
            {
                Currency = "USD",
                DiscountPercentage = 10,
                EffectivePrice = 90,
                PriceAmount = 100,
                ProductId = 1,
                VendorId = 1
            };

            _priceServiceMock.Setup(service => service.GetPriceByIdAsync(It.IsAny<int>()))
                             .ReturnsAsync(priceDto);

            // Act
            var result = await _controller.GetPriceById(1);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(priceDto, okResult.Value);
        }

        [TestMethod]
        public async Task GetPriceById_PriceNotFound_ReturnsNotFound()
        {
            // Arrange
            _priceServiceMock.Setup(service => service.GetPriceByIdAsync(It.IsAny<int>()))
                             .ReturnsAsync((PriceDto)null);

            // Act
            var result = await _controller.GetPriceById(1);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }

        #endregion

        #region UpdatePrice Tests

        [TestMethod]
        public async Task UpdatePrice_ValidModel_ReturnsOk()
        {
            // Arrange
            var priceDto = new PriceDto
            {
                Currency = "USD",
                DiscountPercentage = 10,
                EffectivePrice = 90,
                PriceAmount = 100,
                ProductId = 1,
                VendorId = 1
            };

            // Act
            var result = await _controller.UpdatePrice(1, priceDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
        }

        [TestMethod]
        public async Task UpdatePrice_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            var priceDto = new PriceDto(); // Invalid model
            _controller.ModelState.AddModelError("Error", "Model is invalid");

            // Act
            var result = await _controller.UpdatePrice(1, priceDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
        }

        #endregion
    }
}