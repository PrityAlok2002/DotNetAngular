using System;
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
    public class OrderDetailRepositoryTest
    {
        private ApplicationDbContext _context;
        private OrderDetailRepository _repository;

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
            _repository = new OrderDetailRepository(_context);

            // Seed the database with test data
            if (!_context.OrderDetails.Any())
            {
                _context.OrderDetails.AddRange(new List<OrderDetail>
            {
                new OrderDetail { Id = 1, OrderId = 1, TotalAmount = 100.00m, OrderDate = DateTime.UtcNow, CustomerName = "Customer1", OrderStatus = "Pending", PaymentMethod = "CreditCard" },
                new OrderDetail { Id = 2, OrderId = 2, TotalAmount = 200.00m, OrderDate = DateTime.UtcNow, CustomerName = "Customer2", OrderStatus = "Completed", PaymentMethod = "PayPal" },
                new OrderDetail { Id = 3, OrderId = 3, TotalAmount = 300.00m, OrderDate = DateTime.UtcNow, CustomerName = "Customer3", OrderStatus = "Shipped", PaymentMethod = "BankTransfer" }
            });

                _context.SaveChanges();
            }
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsOrderDetail_WhenItemExists()
        {
            // Act
            var result = await _repository.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Id);
            Assert.AreEqual(100.00m, result.TotalAmount);
            Assert.AreEqual("Customer1", result.CustomerName);
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
        public async Task GetAllAsync_ReturnsAllOrderDetails()
        {
            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.AreEqual(3, result.Count());
            Assert.IsTrue(result.Any(od => od.Id == 1));
            Assert.IsTrue(result.Any(od => od.Id == 2));
            Assert.IsTrue(result.Any(od => od.Id == 3));
        }

        [TestMethod]
        public async Task UpdateAsync_UpdatesOrderDetail()
        {
            // Arrange
            var orderDetail = await _repository.GetByIdAsync(1);
            orderDetail.TotalAmount = 150.00m;

            // Act
            await _repository.UpdateAsync(orderDetail);
            var updatedOrderDetail = await _repository.GetByIdAsync(1);

            // Assert
            Assert.IsNotNull(updatedOrderDetail);
            Assert.AreEqual(150.00m, updatedOrderDetail.TotalAmount);
        }
    }
}
