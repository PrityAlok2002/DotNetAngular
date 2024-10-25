using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class ProductImageRepositoryTest
    {
        private ApplicationDbContext _context;
        private ProductImageRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase_" + Guid.NewGuid())
                .Options;

            _context = new ApplicationDbContext(options);

            // Adding some initial data
            _context.ProductImages.Add(new ProductImage
            {
                ImageId = 1,
                ProductId = 1,
                ImageUrl = "http://example.com/image1.jpg"
            });
            _context.ProductImages.Add(new ProductImage
            {
                ImageId = 2,
                ProductId = 1,
                ImageUrl = "http://example.com/image2.jpg"
            });
            _context.ProductImages.Add(new ProductImage
            {
                ImageId = 3,
                ProductId = 2,
                ImageUrl = "http://example.com/image3.jpg"
            });
            _context.SaveChanges();

            _repository = new ProductImageRepository(_context);
        }

        [TestMethod]
        public async Task GetImageByIdAsync_ReturnsProductImage_WhenImageExists()
        {
            // Act
            var result = await _repository.GetImageByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.ImageId);
            Assert.AreEqual("http://example.com/image1.jpg", result.ImageUrl);
        }

        [TestMethod]
        public async Task GetImageByIdAsync_ReturnsNull_WhenImageDoesNotExist()
        {
            // Act
            var result = await _repository.GetImageByIdAsync(999);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task GetImagesByProductIdAsync_ReturnsImagesForProduct()
        {
            // Act
            var result = await _repository.GetImagesByProductIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            var images = result.ToList();
            Assert.AreEqual(2, images.Count);
            Assert.IsTrue(images.Any(pi => pi.ImageId == 1));
            Assert.IsTrue(images.Any(pi => pi.ImageId == 2));
        }

        [TestMethod]
        public async Task GetImagesByProductIdAsync_ReturnsEmptyList_WhenNoImagesForProduct()
        {
            // Act
            var result = await _repository.GetImagesByProductIdAsync(999);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count());
        }
    }
}
