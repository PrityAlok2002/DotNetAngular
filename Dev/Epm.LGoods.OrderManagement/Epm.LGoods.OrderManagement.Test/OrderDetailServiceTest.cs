using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Application.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class OrderDetailServiceTest
    {
        private Mock<IOrderRepository> _mockOrderRepository;
        private Mock<ICustomerRepository> _mockCustomerRepository;
        private Mock<IOrderItemRepository> _mockOrderItemRepository;
        private Mock<IProductImageRepository> _mockProductImageRepository;
        private OrderDetailService _service;

        [TestInitialize]
        public void Setup()
        {
            _mockOrderRepository = new Mock<IOrderRepository>();
            _mockCustomerRepository = new Mock<ICustomerRepository>();
            _mockOrderItemRepository = new Mock<IOrderItemRepository>();
            _mockProductImageRepository = new Mock<IProductImageRepository>();
            _service = new OrderDetailService(
                _mockOrderRepository.Object,
                _mockCustomerRepository.Object,
                _mockOrderItemRepository.Object,
                _mockProductImageRepository.Object
            );
        }

        [TestMethod]
        public async Task GetOrderDetailsAsync_ReturnsOrderDetailDto_WhenOrderExists()
        {
            // Arrange
            var order = new Order
            {
                Id = 1,
                CustomerId = 1,
                TotalAmount = 100,
                OrderDate = DateTime.Now,
                OrderStatus = "Pending",
                PaymentMethod = "Credit Card"
            };

            var customer = new Customer
            {
                Id = 1,
                Name = "John Doe"
            };

            var orderItems = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductId = 1,
                    Quantity = 2,
                    CostPrice = 10,
                    DiscountedPrice = 8,
                    Product = new Product
                    {
                        ProductName = "Product A",
                        ShortDescription = "Description A"
                    }
                },
                new OrderItem
                {
                     ProductId = 2,
                     Quantity = 3,
                     CostPrice = 15,
                     DiscountedPrice = 12,
                     Product = new Product
                     {
                        ProductName = "Product B",
                        ShortDescription = "Description B"
                     }
                }
            };

            var productImages = new List<ProductImage>
            {
                new ProductImage { ImageId = 1, ProductId = 1, ImageUrl = "http://example.com/image1.jpg", IsMain = true },
                new ProductImage { ImageId = 2, ProductId = 2, ImageUrl = "http://example.com/image2.jpg", IsMain = false }
            };

            _mockOrderRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(order);
            _mockCustomerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(customer);
            _mockOrderItemRepository.Setup(repo => repo.GetByOrderDetailsIdAsync(1)).ReturnsAsync(orderItems);
            _mockProductImageRepository.Setup(repo => repo.GetImagesByProductIdAsync(1)).ReturnsAsync(productImages.Where(pi => pi.ProductId == 1));
            _mockProductImageRepository.Setup(repo => repo.GetImagesByProductIdAsync(2)).ReturnsAsync(productImages.Where(pi => pi.ProductId == 2));

            // Act
            var result = await _service.GetOrderDetailsAsync(1);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.OrderId);
            Assert.AreEqual("John Doe", result.CustomerName);
            Assert.AreEqual(2, result.Products.Count); // Check the number of products
            Assert.AreEqual("Product A", result.Products[0].ProductName);
            Assert.AreEqual("Product B", result.Products[1].ProductName);
        }


        [TestMethod]
        public async Task GetOrderDetailsAsync_ReturnsNull_WhenOrderDoesNotExist()
        {
            // Arrange
            _mockOrderRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync((Order)null);

            // Act
            var result = await _service.GetOrderDetailsAsync(1);

            // Assert
            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task GetAllOrderDetailsAsync_ReturnsOrderDetailDtos()
        {
            // Arrange
            var orders = new List<Order>
            {
                new Order { Id = 1, CustomerId = 1, TotalAmount = 100, OrderDate = DateTime.Now, OrderStatus = "Pending", PaymentMethod = "Credit Card" }
            };
            var customer = new Customer { Id = 1, Name = "John Doe" };
            var orderItems = new List<OrderItem>
            {
                new OrderItem { ProductId = 1, Quantity = 2, CostPrice = 10, DiscountedPrice = 8, Product = new Product { ProductName = "Product A", ShortDescription = "Description A" } }
            };

            _mockOrderRepository.Setup(repo => repo.GetAllAsync()).ReturnsAsync(orders);
            _mockCustomerRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(customer);
            _mockOrderItemRepository.Setup(repo => repo.GetByOrderDetailsIdAsync(1)).ReturnsAsync(orderItems);
            _mockProductImageRepository.Setup(repo => repo.GetImagesByProductIdAsync(1)).ReturnsAsync(new List<ProductImage>());

            // Act
            var result = await _service.GetAllOrderDetailsAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count());
            var orderDetailDto = result.First();
            Assert.AreEqual(1, orderDetailDto.OrderId);
            Assert.AreEqual("John Doe", orderDetailDto.CustomerName);
        }

        [TestMethod]
        public async Task UpdateOrderDetailsAsync_ReturnsTrue()
        {
            // Arrange
            var orderDetailDto = new OrderDetailDto { OrderId = 1 };

            // Act
            var result = await _service.UpdateOrderDetailsAsync(orderDetailDto);

            // Assert
            Assert.IsTrue(result);
        }
    }
}
