using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Epm.LGoods.OrderManagement.Tests
{
    [TestClass]
    public class OrderItemRepositoryTest
    {
        private ApplicationDbContext _context;
        private OrderItemRepository _repository;

        [TestInitialize]
        public void Setup()
        {
            // Create an in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            // Create a new context using the in-memory database
            _context = new ApplicationDbContext(options);

            // Initialize the repository with the in-memory context
            _repository = new OrderItemRepository(_context);

            // Clear any existing data to prevent duplicate key issues
            _context.OrderItems.RemoveRange(_context.OrderItems);
            _context.Products.RemoveRange(_context.Products);
            _context.SaveChanges();

            // Seed the database with test data
            _context.Products.AddRange(new List<Product>
            {
                new Product { ProductId = 1, ProductName = "Product1", ShortDescription = "Description1" },
                new Product { ProductId = 2, ProductName = "Product2", ShortDescription = "Description2" },
                new Product { ProductId = 3, ProductName = "Product3", ShortDescription = "Description3" }
            });

            _context.OrderItems.AddRange(new List<OrderItem>
            {
                new OrderItem { Id = 1, OrderId = 1, ProductId = 1 },
                new OrderItem { Id = 2, OrderId = 1, ProductId = 2 },
                new OrderItem { Id = 3, OrderId = 2, ProductId = 3 }
            });

            _context.SaveChanges();
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsOrderItemWithProduct_WhenItemExists()
        {
            // Act
            var result = await _repository.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual("Product1", result.Product.ProductName);
            Assert.AreEqual("Description1", result.Product.ShortDescription);
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsNull_WhenItemDoesNotExist()
        {
            // Act
            var result = await _repository.GetByIdAsync(999); // ID that doesn't exist

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task GetByOrderDetailsIdAsync_ReturnsOrderItemsWithProducts_WhenItemsExist()
        {
            // Act
            var result = await _repository.GetByOrderDetailsIdAsync(1);

            // Assert
            Assert.AreEqual(2, result.Count());
            Assert.IsTrue(result.Any(oi => oi.Id == 1 && oi.Product.ProductName == "Product1"));
            Assert.IsTrue(result.Any(oi => oi.Id == 2 && oi.Product.ProductName == "Product2"));
        }

        [TestMethod]
        public async Task GetByOrderDetailsIdAsync_ReturnsEmptyList_WhenNoItemsFound()
        {
            // Act
            var result = await _repository.GetByOrderDetailsIdAsync(999); // OrderId that doesn't exist

            // Assert
            Assert.IsFalse(result.Any());
        }
    }
}
