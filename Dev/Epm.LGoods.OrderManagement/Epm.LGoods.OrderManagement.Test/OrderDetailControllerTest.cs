using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Test
{
    [TestClass]
    public class OrderDetailControllerTest
    {
        private Mock<IOrderDetailService> _mockOrderDetailService;
        private OrderDetailController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockOrderDetailService = new Mock<IOrderDetailService>();
            _controller = new OrderDetailController(_mockOrderDetailService.Object);
        }

        [TestMethod]
        public async Task GetOrderDetails_ReturnsOkResult_WhenOrderExists()
        {
            // Arrange
            var orderId = 1;
            var orderDetailDto = new OrderDetailDto { OrderId = orderId };
            _mockOrderDetailService.Setup(service => service.GetOrderDetailsAsync(orderId))
                .ReturnsAsync(orderDetailDto);

            // Act
            var result = await _controller.GetOrderDetails(orderId) as ActionResult<OrderDetailDto>;

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(orderDetailDto, okResult.Value);
        }


        [TestMethod]
        public async Task GetOrderDetails_ReturnsNotFound_WhenOrderDoesNotExist()
        {
            // Arrange
            var orderId = 1;
            _mockOrderDetailService.Setup(service => service.GetOrderDetailsAsync(orderId))
                .ReturnsAsync((OrderDetailDto)null);

            // Act
            var result = await _controller.GetOrderDetails(orderId) as ActionResult<OrderDetailDto>;

            // Assert
            var notFoundResult = result.Result as NotFoundResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }


        [TestMethod]
        public async Task GetAllOrderDetails_ReturnsOkResult_WithOrderList()
        {
            // Arrange
            var orderDetailsList = new List<OrderDetailDto>
            {
                new OrderDetailDto { OrderId = 1 },
                new OrderDetailDto { OrderId = 2 }
            };
            _mockOrderDetailService.Setup(service => service.GetAllOrderDetailsAsync())
                .ReturnsAsync(orderDetailsList);

            // Act
            var result = await _controller.GetAllOrderDetails() as ActionResult<IEnumerable<OrderDetailDto>>;

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            CollectionAssert.AreEqual(orderDetailsList, okResult.Value as List<OrderDetailDto>);
        }


        [TestMethod]
        public async Task UpdateOrderDetails_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            // Arrange
            var orderId = 1;
            var orderDetailDto = new OrderDetailDto { OrderId = orderId };
            _mockOrderDetailService.Setup(service => service.UpdateOrderDetailsAsync(orderDetailDto))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateOrderDetails(orderId, orderDetailDto) as NoContentResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(204, result.StatusCode);
        }

        [TestMethod]
        public async Task UpdateOrderDetails_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var orderId = 1;
            var orderDetailDto = new OrderDetailDto { OrderId = 2 };

            // Act
            var result = await _controller.UpdateOrderDetails(orderId, orderDetailDto) as BadRequestObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Order ID mismatch.", result.Value);
        }

        [TestMethod]
        public async Task UpdateOrderDetails_ReturnsNotFound_WhenUpdateFails()
        {
            // Arrange
            var orderId = 1;
            var orderDetailDto = new OrderDetailDto { OrderId = orderId };
            _mockOrderDetailService.Setup(service => service.UpdateOrderDetailsAsync(orderDetailDto))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateOrderDetails(orderId, orderDetailDto) as NotFoundResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
        }
    }
}
