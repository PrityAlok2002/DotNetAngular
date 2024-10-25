using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class PriceRepositoryTest
    {
        private ApplicationDbContext _context;
        private PriceRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique database for each test
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new PriceRepository(_context);
        }

        #region AddPriceAsync Test

        [TestMethod]
        public async Task AddPriceAsync_ValidPrice_AddsPriceToDatabase()
        {
            // Arrange
            var price = new Price
            {
                PriceId = 1,
                Currency = "USD",
                DiscountPercentage = 10,
                EffectivePrice = 90,
                PriceAmount = 100,
                ProductId = 1,
                VendorId = 1
            };

            // Act
            await _repository.AddPriceAsync(price);

            // Assert
            var savedPrice = await _context.Prices.FindAsync(price.PriceId);
            Assert.IsNotNull(savedPrice, "Price should have been added to the database.");
            Assert.AreEqual(price.Currency, savedPrice.Currency, "Currency should match.");
        }

        #endregion

        #region GetPriceByIdAsync Test

        [TestMethod]
        public async Task GetPriceByIdAsync_PriceExists_ReturnsPrice()
        {
            // Arrange
            var price = new Price
            {
                PriceId = 1,
                Currency = "USD",
                DiscountPercentage = 10,
                EffectivePrice = 90,
                PriceAmount = 100,
                ProductId = 1,
                VendorId = 1
            };

            await _repository.AddPriceAsync(price);

            // Act
            var result = await _repository.GetPriceByIdAsync(1);

            // Assert
            Assert.IsNotNull(result, "Price should be retrieved from the database.");
            Assert.AreEqual(price.PriceId, result.PriceId, "Price ID should match.");
        }

        #endregion

        #region UpdatePriceAsync Test

        [TestMethod]
        public async Task UpdatePriceAsync_ValidPrice_UpdatesPriceInDatabase()
        {
            // Arrange
            var price = new Price
            {
                PriceId = 1,
                Currency = "USD",
                DiscountPercentage = 10,
                EffectivePrice = 90,
                PriceAmount = 100,
                ProductId = 1,
                VendorId = 1
            };

            await _repository.AddPriceAsync(price);

            // Act
            price.DiscountPercentage = 15;
            await _repository.UpdatePriceAsync(price);

            // Assert
            var updatedPrice = await _context.Prices.FindAsync(price.PriceId);
            Assert.IsNotNull(updatedPrice, "Price should be present in the database.");
            Assert.AreEqual(15, updatedPrice.DiscountPercentage, "Discount Percentage should be updated.");
        }

        #endregion
    }
}
