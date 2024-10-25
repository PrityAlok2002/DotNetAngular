using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Application.Services;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;


namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class PriceServiceTest
    {
        private Mock<IPriceRepository> _mockPriceRepository;
        private PriceService _priceService;

        [TestInitialize]
        public void Setup()
        {
            _mockPriceRepository = new Mock<IPriceRepository>();
            _priceService = new PriceService(_mockPriceRepository.Object);
        }

        #region AddPriceAsync Tests

        [TestMethod]
        public async Task AddPriceAsync_ValidPrice_AddsPriceToRepository()
        {
            // Arrange
            var priceDto = new PriceDto
            {
                ProductId = 1,
                PriceAmount = 100,
                Currency = "USD",
                VendorId = 1,
                DiscountPercentage = 10
            };

            // Act
            await _priceService.AddPriceAsync(priceDto);

            // Assert
            _mockPriceRepository.Verify(repo => repo.AddPriceAsync(It.IsAny<Price>()), Times.Once);
        }


        #endregion

        #region GetPriceByIdAsync Tests

        [TestMethod]
        public async Task GetPriceByIdAsync_PriceExists_ReturnsPriceDto()
        {
            // Arrange
            var price = new Price
            {
                PriceId = 1,
                ProductId = 1,
                PriceAmount = 100,
                Currency = "USD",
                VendorId = 1,
                DiscountPercentage = 10,
                EffectivePrice = 90
            };

            _mockPriceRepository.Setup(repo => repo.GetPriceByIdAsync(1)).ReturnsAsync(price);

            var expectedPriceDto = new PriceDto
            {
                ProductId = price.ProductId,
                PriceAmount = price.PriceAmount,
                Currency = price.Currency,
                VendorId = price.VendorId,
                DiscountPercentage = price.DiscountPercentage,
                EffectivePrice = price.EffectivePrice
            };

            // Act
            var result = await _priceService.GetPriceByIdAsync(1);

            // Assert
            Assert.IsNotNull(result, "PriceDto should be returned.");
            Assert.AreEqual(expectedPriceDto.ProductId, result.ProductId, "Product ID should match.");
            Assert.AreEqual(expectedPriceDto.Currency, result.Currency, "Currency should match.");
            Assert.AreEqual(expectedPriceDto.EffectivePrice, result.EffectivePrice, "Effective Price should match.");
        }

        [TestMethod]
        public async Task GetPriceByIdAsync_PriceDoesNotExist_ReturnsNull()
        {
            // Arrange
            _mockPriceRepository.Setup(repo => repo.GetPriceByIdAsync(999)).ReturnsAsync((Price)null);

            // Act
            var result = await _priceService.GetPriceByIdAsync(999);

            // Assert
            Assert.IsNull(result, "PriceDto should be null when price does not exist.");
        }

        #endregion

        #region UpdatePriceAsync Tests

        [TestMethod]
        public async Task UpdatePriceAsync_ValidPrice_UpdatesPriceInRepository()
        {
            // Arrange
            var existingPrice = new Price
            {
                PriceId = 1,
                ProductId = 1,
                PriceAmount = 100,
                Currency = "USD",
                VendorId = 1,
                DiscountPercentage = 10,
                EffectivePrice = 90
            };

            var priceDto = new PriceDto
            {
                PriceAmount = 150,
                Currency = "EUR",
                VendorId = 2,
                DiscountPercentage = 5
            };

            _mockPriceRepository.Setup(repo => repo.GetPriceByIdAsync(1)).ReturnsAsync(existingPrice);

            // Act
            await _priceService.UpdatePriceAsync(1, priceDto);

            // Assert
            _mockPriceRepository.Verify(repo => repo.UpdatePriceAsync(It.Is<Price>(p =>
                p.PriceAmount == 150 &&
                p.Currency == "EUR" &&
                p.VendorId == 2 &&
                p.DiscountPercentage == 5 &&
                p.EffectivePrice == 142.5m)), Times.Once);
        }

        [TestMethod]
        public async Task UpdatePriceAsync_PriceDoesNotExist_DoesNotUpdateRepository()
        {
            // Arrange
            var priceDto = new PriceDto
            {
                PriceAmount = 150,
                Currency = "EUR",
                VendorId = 2,
                DiscountPercentage = 5
            };

            _mockPriceRepository.Setup(repo => repo.GetPriceByIdAsync(1)).ReturnsAsync((Price)null);

            // Act
            await _priceService.UpdatePriceAsync(1, priceDto);

            // Assert
            _mockPriceRepository.Verify(repo => repo.UpdatePriceAsync(It.IsAny<Price>()), Times.Never);
        }

        #endregion
    }
}
