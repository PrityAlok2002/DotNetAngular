using Epm.LGoods.OrderManagement.Api.Controllers;
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;


namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class OrdersControllerTests
    {
        private Mock<IOrderService> _mockOrderService;
        private OrdersController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockOrderService = new Mock<IOrderService>();
            _controller = new OrdersController(_mockOrderService.Object);
        }

        [TestMethod]
        public async Task GetOrder_ReturnsOrder_WhenOrderExists()
        {
            // Arrange
            int orderId = 1;
            var expectedOrder = new OrderDto { Id = orderId, CustomerName = "Test Customer" };
            _mockOrderService.Setup(s => s.GetOrderAsync(orderId)).ReturnsAsync(expectedOrder);

            // Act
            var result = await _controller.GetOrder(orderId);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = result.Result as OkObjectResult;
            Assert.IsInstanceOfType(okResult.Value, typeof(OrderDto));
            var returnedOrder = okResult.Value as OrderDto;
            Assert.AreEqual(expectedOrder.Id, returnedOrder.Id);
            Assert.AreEqual(expectedOrder.CustomerName, returnedOrder.CustomerName);
        }

        [TestMethod]
        public async Task GetOrder_ReturnsNotFound_WhenOrderDoesNotExist()
        {
            // Arrange
            int orderId = 1;
            _mockOrderService.Setup(s => s.GetOrderAsync(orderId)).ReturnsAsync((OrderDto)null);

            // Act
            var result = await _controller.GetOrder(orderId);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));
        }

        [TestMethod]
        public async Task GetAllOrders_ReturnsAllOrders()
        {
            // Arrange
            var expectedOrders = new List<OrderDto>
            {
                new OrderDto { Id = 1, CustomerName = "Customer 1" },
                new OrderDto { Id = 2, CustomerName = "Customer 2" }
            };
            _mockOrderService.Setup(s => s.GetAllOrdersAsync()).ReturnsAsync(expectedOrders);

            // Act
            var result = await _controller.GetAllOrders();

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = result.Result as OkObjectResult;
            Assert.IsInstanceOfType(okResult.Value, typeof(IEnumerable<OrderDto>));
            var returnedOrders = okResult.Value as IEnumerable<OrderDto>;
            Assert.AreEqual(expectedOrders.Count, ((List<OrderDto>)returnedOrders).Count);
        }

        [TestMethod]
        public async Task UpdateOrderStatus_ReturnsBadRequest_WhenOrderIdMismatch()
        {
            // Arrange
            int orderId = 1;
            var updateDto = new UpdateOrderStatusDto { OrderId = 2, NewStatus = "Shipped" };

            // Act
            var result = await _controller.UpdateOrderStatus(orderId, updateDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            var badRequestResult = result as BadRequestObjectResult;
            Assert.AreEqual("Order ID mismatch.", badRequestResult.Value);
        }

        [TestMethod]
        public async Task UpdateOrderStatus_ReturnsNoContent_WhenUpdateSuccessful()
        {
            // Arrange
            int orderId = 1;
            var updateDto = new UpdateOrderStatusDto { OrderId = orderId, NewStatus = "Shipped" };
            _mockOrderService.Setup(s => s.UpdateOrderStatusAsync(updateDto)).ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateOrderStatus(orderId, updateDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
        }

        [TestMethod]
        public async Task UpdateOrderStatus_ReturnsBadRequest_WhenUpdateFails()
        {
            // Arrange
            int orderId = 1;
            var updateDto = new UpdateOrderStatusDto { OrderId = orderId, NewStatus = "InvalidStatus" };
            _mockOrderService.Setup(s => s.UpdateOrderStatusAsync(updateDto)).ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateOrderStatus(orderId, updateDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            var badRequestResult = result as BadRequestObjectResult;
            Assert.AreEqual("Invalid order ID or status transition.", badRequestResult.Value);
        }



        [TestMethod]
        public async Task GetLatestOrder_ReturnsLatestOrders_WhenOrdersExist()
        {
            // Arrange
            var expectedLatestOrders = new List<LatestOrderDto>
            {
                new LatestOrderDto { CustomerId = 1, PaymentMethod = "Credit Card", TotalAmount = 100.00m, OrderDate = DateTime.UtcNow, OrderStatus = "Pending" },
                new LatestOrderDto { CustomerId = 2, PaymentMethod = "PayPal", TotalAmount = 50.00m, OrderDate = DateTime.UtcNow, OrderStatus = "Shipped" }
            };
            _mockOrderService.Setup(s => s.GetLatestOrdersAsync()).ReturnsAsync(expectedLatestOrders);

            // Act
            var result = await _controller.GetLatestOrder();

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkObjectResult));
            var okResult = result as OkObjectResult;
            Assert.IsInstanceOfType(okResult.Value, typeof(IEnumerable<LatestOrderDto>));
            var returnedOrders = okResult.Value as IEnumerable<LatestOrderDto>;
            Assert.AreEqual(expectedLatestOrders.Count, ((List<LatestOrderDto>)returnedOrders).Count);
        }

        [TestMethod]
        public async Task GetLatestOrder_ReturnsNotFound_WhenNoLatestOrdersExist()
        {
            // Arrange
            _mockOrderService.Setup(s => s.GetLatestOrdersAsync()).ReturnsAsync((List<LatestOrderDto>)null);

            // Act
            var result = await _controller.GetLatestOrder();

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundResult));
        }
    }
}
