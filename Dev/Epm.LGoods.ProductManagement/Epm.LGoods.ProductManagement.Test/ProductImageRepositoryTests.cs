using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Epm.LGoods.ProductManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Test
{
    [TestClass]
    public class ProductImageRepositoryTests
    {
        private ApplicationDbContext _context;
        private ProductImageRepository _repository;

        [TestInitialize]
        public void Initialize()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _repository = new ProductImageRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [TestMethod]
        public async Task GetAllProductImagesAsync_ReturnsAllImages()
        {
            // Arrange
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "url1", ProductId = 1, IsMain = true },
                new ProductImage { ImageUrl = "url2", ProductId = 1, IsMain = false },
                new ProductImage { ImageUrl = "url3", ProductId = 2, IsMain = true }
            };
            _context.ProductImages.AddRange(productImages);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllProductImagesAsync();

            // Assert
            Assert.AreEqual(3, result.Count());
        }

        [TestMethod]
        public async Task SaveProductImages_SavesImages()
        {
            // Arrange
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "url1", ProductId = 1, IsMain = true },
                new ProductImage { ImageUrl = "url2", ProductId = 1, IsMain = false }
            };

            // Act
            await _repository.SaveProductImages(productImages);

            // Assert
            var result = await _context.ProductImages.ToListAsync();
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual("url1", result[0].ImageUrl);
            Assert.AreEqual(1, result[0].ProductId);
            Assert.IsTrue(result[0].IsMain);
        }

        [TestMethod]
        public async Task SaveProductImages_AddsImagesToExistingOnes()
        {
            // Arrange
            var existingProductImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "url1", ProductId = 1, IsMain = true }
            };
            _context.ProductImages.AddRange(existingProductImages);
            await _context.SaveChangesAsync();

            var newProductImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "url2", ProductId = 1, IsMain = false },
                new ProductImage { ImageUrl = "url3", ProductId = 2, IsMain = true }
            };

            // Act
            await _repository.SaveProductImages(newProductImages);

            // Assert
            var result = await _context.ProductImages.ToListAsync();
            Assert.AreEqual(3, result.Count);
        }


        [TestMethod]
        public async Task CountAsync_ReturnsCorrectCount()
        {
            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageUrl = "url1", ProductId = 1, IsMain = true },
                new ProductImage { ImageUrl = "url2", ProductId = 1, IsMain = false },
                new ProductImage { ImageUrl = "url3", ProductId = 2, IsMain = true }
            };
            _context.ProductImages.AddRange(productImages);
            await _context.SaveChangesAsync();

            var count = await _repository.CountAsync();

            Assert.AreEqual(3, count);
        }
    }
}