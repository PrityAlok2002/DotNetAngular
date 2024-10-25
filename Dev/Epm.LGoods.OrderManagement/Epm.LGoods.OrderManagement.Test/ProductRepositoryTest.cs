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
    public class ProductRepositoryTest
    {
        private ApplicationDbContext _context;
        private ProductRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase_" + Guid.NewGuid())
                .Options;

            _context = new ApplicationDbContext(options);

            // Adding some initial data
            _context.Products.Add(new Product
            {
                ProductId = 1,
                ProductName = "Product 1",
                ShortDescription = "Description for Product 1"
            });
            _context.Products.Add(new Product
            {
                ProductId = 2,
                ProductName = "Product 2",
                ShortDescription = "Description for Product 2"
            });
            _context.Products.Add(new Product
            {
                ProductId = 3,
                ProductName = "Product 3",
                ShortDescription = "Description for Product 3"
            });
            _context.SaveChanges();

            _repository = new ProductRepository(_context);
        }

        [TestMethod]
        public async Task GetProductByIdAsync_ReturnsProduct_WhenProductExists()
        {
            // Act
            var result = await _repository.GetProductByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.ProductId);
            Assert.AreEqual("Product 1", result.ProductName);
            Assert.AreEqual("Description for Product 1", result.ShortDescription);
        }

        [TestMethod]
        public async Task GetProductByIdAsync_ReturnsNull_WhenProductDoesNotExist()
        {
            // Act
            var result = await _repository.GetProductByIdAsync(999);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task GetAllProductsAsync_ReturnsAllProducts()
        {
            // Act
            var result = await _repository.GetAllProductsAsync();

            // Assert
            Assert.IsNotNull(result);
            var products = result.ToList();
            Assert.AreEqual(3, products.Count);
            Assert.IsTrue(products.Any(p => p.ProductId == 1));
            Assert.IsTrue(products.Any(p => p.ProductId == 2));
            Assert.IsTrue(products.Any(p => p.ProductId == 3));
        }
    }
}
