using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Infrastructure.Data;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class OrderRepositoryTests
    {
        private OrderRepository _orderRepository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void TestInitialize()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase") // Use in-memory database
                .Options;

            _context = new ApplicationDbContext(options);
            _orderRepository = new OrderRepository(_context);
        }


        [TestMethod]
        public async Task GetByIdAsync_WhenCalled_ReturnsOrder()
        {
            var orderId = 1;
            var order = new Order { Id = orderId, OrderStatus = "Pending", PaymentMethod = "Credit Card" };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var result = await _orderRepository.GetByIdAsync(orderId);

            Assert.AreEqual(order, result);
        }


        [TestMethod]
        public async Task GetAllAsync_WhenCalled_ReturnsAllOrders()
        {
            var order1 = new Order { Id = 1, OrderStatus = "Pending", PaymentMethod = "Credit Card" };
            var order2 = new Order { Id = 2, OrderStatus = "Pending", PaymentMethod = "Credit Card" };
            _context.Orders.AddRange(order1, order2);
            await _context.SaveChangesAsync();

            var result = await _orderRepository.GetAllAsync();

            Assert.AreEqual(2, result.Count());
        }

        [TestMethod]
        public async Task UpdateAsync_WhenCalled_UpdatesOrder()
        {
            var order = new Order { Id = 1, OrderStatus = "Pending", PaymentMethod = "Credit Card" };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            order.OrderStatus = "Shipped";
            await _orderRepository.UpdateAsync(order);

            var updatedOrder = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual("Shipped", updatedOrder.OrderStatus);
        }
        [TestCleanup]
        public void TestCleanup()
        {
            _context.Database.EnsureDeleted(); // Clean up the in-memory database
        }

    //    [TestMethod]
    //    public async Task GetLatestOrdersAsync_WhenCalled_ReturnsLatestOrders()
    //    {
    //        var orders = new List<Order>
    //{
    //    new Order { Id = 1, OrderStatus = "Pending", OrderDate = DateTime.UtcNow.AddDays(-1) },
    //    new Order { Id = 2, OrderStatus = "Shipped", OrderDate = DateTime.UtcNow }
    //};

    //        _context.Orders.AddRange(orders);
    //        await _context.SaveChangesAsync();

    //        var result = await _orderRepository.GetLatestOrdersAsync();

    //        Assert.AreEqual(2, result.Count);
    //        Assert.AreEqual(2, result.First().Id);
    //        Assert.AreEqual(1, result.Last().Id);
    //    }


    }
}
