using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{


    [TestClass]
    public class OrderServiceTests
    {
        private Mock<IOrderRepository> _orderRepositoryMock;
        private Mock<ICustomerRepository> _customerRepositoryMock;
        private Mock<IAddressRepository> _addressRepositoryMock;
        private OrderService _orderService;

        [TestInitialize]
        public void Setup()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _customerRepositoryMock = new Mock<ICustomerRepository>();
            _addressRepositoryMock = new Mock<IAddressRepository>();
            _orderService = new OrderService(_orderRepositoryMock.Object, _customerRepositoryMock.Object, _addressRepositoryMock.Object);
        }

        [TestMethod]
        public async Task GetOrderAsync_ShouldReturnOrderDto_WhenOrderExists()
        {
            var order = new Order
            {
                Id = 1,
                CustomerId = 1,
                AddressId = 1,
                OrderDate = DateTime.UtcNow,
                OrderStatus = "Pending",
                TotalAmount = 100,
                PaymentMethod = "CreditCard"
            };

            var customer = new Customer
            {
                Id = 1,
                Name = "John Doe",
                PhoneNumber = "1234567890"
            };

            var address = new Address
            {
                AddressId = 1,
                HouseNo = "123",
                Building = "Building A",
                Landmark = "Near Park",
                AddressLabel = "Home"
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(order);
            _customerRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(customer);
            _addressRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(address);

            var result = await _orderService.GetOrderAsync(1);

            Assert.IsNotNull(result);
            Assert.AreEqual(order.Id, result.Id);
            Assert.AreEqual(customer.Name, result.CustomerName);
            Assert.AreEqual(address.HouseNo, result.HouseNo);
        }

        [TestMethod]
        public async Task GetOrderAsync_ShouldReturnNull_WhenOrderDoesNotExist()
        {
            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Order)null);

            var result = await _orderService.GetOrderAsync(999);

            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task GetAllOrdersAsync_ShouldReturnListOfOrderDtos()
        {
            var orders = new List<Order>
    {
        new Order
        {
            Id = 1,
            CustomerId = 1,
            AddressId = 1,
            OrderDate = DateTime.UtcNow,
            OrderStatus = "Pending",
            TotalAmount = 100,
            PaymentMethod = "CreditCard"
        }
    };

            var customer = new Customer
            {
                Id = 1,
                Name = "John Doe",
                PhoneNumber = "1234567890"
            };

            var address = new Address
            {
                AddressId = 1,
                HouseNo = "123",
                Building = "Building A",
                Landmark = "Near Park",
                AddressLabel = "Home"
            };

            _orderRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(orders);
            _customerRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(customer);
            _addressRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(address);

            var result = await _orderService.GetAllOrdersAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count()); 
            var orderDto = result.First();
            Assert.AreEqual(customer.Name, orderDto.CustomerName);
            Assert.AreEqual(address.HouseNo, orderDto.HouseNo);
        }


        [TestMethod]
        public async Task UpdateOrderStatusAsync_ShouldReturnTrue_WhenStatusUpdateIsSuccessful()
        {
            var order = new Order
            {
                Id = 1,
                OrderStatus = "Pending"
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).Returns(Task.CompletedTask);

            var updateOrderStatusDto = new UpdateOrderStatusDto
            {
                OrderId = 1,
                NewStatus = "Shipped"
            };

            var result = await _orderService.UpdateOrderStatusAsync(updateOrderStatusDto);

            // Assert
            Assert.IsTrue(result);
            Assert.AreEqual("Shipped", order.OrderStatus);
        }

        [TestMethod]
        public async Task UpdateOrderStatusAsync_ShouldReturnFalse_WhenOrderDoesNotExist()
        {
            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(999)).ReturnsAsync((Order)null);

            var updateOrderStatusDto = new UpdateOrderStatusDto
            {
                OrderId = 999,
                NewStatus = "Shipped"
            };

            var result = await _orderService.UpdateOrderStatusAsync(updateOrderStatusDto);

            Assert.IsFalse(result);
        }

        [TestMethod]
        public async Task UpdateOrderStatusAsync_ShouldReturnFalse_WhenInvalidStatusTransition()
        {
            var order = new Order
            {
                Id = 1,
                OrderStatus = "Shipped"
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(order);

            var updateOrderStatusDto = new UpdateOrderStatusDto
            {
                OrderId = 1,
                NewStatus = "Pending"
            };

            var result = await _orderService.UpdateOrderStatusAsync(updateOrderStatusDto);

            Assert.IsFalse(result);
        }

        [TestMethod]
        public async Task GetLatestOrdersAsync_ShouldReturnListOfLatestOrderDtos()
        {
            var orders = new List<Order>
    {
        new Order
        {
            CustomerId = 1,
            TotalAmount = 100,
            PaymentMethod = "CreditCard",
            OrderDate = DateTime.UtcNow.AddDays(-1),
            OrderStatus = "Pending"
        },
        new Order
        {
            CustomerId = 2,
            TotalAmount = 150,
            PaymentMethod = "PayPal",
            OrderDate = DateTime.UtcNow,
            OrderStatus = "Shipped"
        }
    };

            _orderRepositoryMock.Setup(repo => repo.GetLatestOrdersAsync()).ReturnsAsync(orders);

            var result = await _orderService.GetLatestOrdersAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(2, result.Count); // Check the count of latest orders
            Assert.AreEqual(orders.First().CustomerId, result.First().CustomerId);
            Assert.AreEqual(orders.First().TotalAmount, result.First().TotalAmount);
            Assert.AreEqual(orders.First().OrderDate, result.First().OrderDate);
            Assert.AreEqual(orders.First().OrderStatus, result.First().OrderStatus);
        }

    }
}
