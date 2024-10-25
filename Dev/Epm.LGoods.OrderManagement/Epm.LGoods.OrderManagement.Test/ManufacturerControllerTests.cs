using Microsoft.VisualStudio.TestTools.UnitTesting;
using Epm.LGoods.OrderManagement.API.Controllers;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.IdentityService.Core.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Newtonsoft.Json;
using System.Linq;
using System;
using Moq.Protected;

namespace ManufacturerControllerTests
{
    [TestClass]
    public class ManufacturerControllerTests
    {
        private Mock<IManufacturerService> _manufacturerServiceMock;
        private Mock<ILogger<ManufacturerController>> _loggerMock;
        private Mock<HttpMessageHandler> _httpMessageHandlerMock;
        private HttpClient _httpClient;
        private ManufacturerController _controller;

        [TestInitialize]
        public void Setup()
        {
            _manufacturerServiceMock = new Mock<IManufacturerService>();
            _loggerMock = new Mock<ILogger<ManufacturerController>>();

            // Setup HttpMessageHandler mock
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _controller = new ManufacturerController(_manufacturerServiceMock.Object, _loggerMock.Object, _httpClient);
        }

        [TestMethod]
        public async Task Get_ShouldReturnOkResult_WithListOfManufacturers()
        {
            // Arrange
            var manufacturers = new List<ManufacturerDTO>
            {
                new ManufacturerDTO { ManufacturerId = 1, ManufacturerName = "Test Manufacturer 1" },
                new ManufacturerDTO { ManufacturerId = 2, ManufacturerName = "Test Manufacturer 2" }
            };

            _manufacturerServiceMock.Setup(service => service.GetAllAsync()).ReturnsAsync(manufacturers);

            // Act
            var result = await _controller.Get();

            // Assert
            var actionResult = result as ActionResult<IEnumerable<ManufacturerDTO>>;
            Assert.IsNotNull(actionResult);
            var okResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual((int)HttpStatusCode.OK, okResult.StatusCode);
            var resultValue = okResult.Value as List<ManufacturerDTO>;
            CollectionAssert.AreEqual(manufacturers, resultValue);
        }

        [TestMethod]
        public async Task Get_ById_ShouldReturnNotFound_WhenManufacturerDoesNotExist()
        {
            // Arrange
            _manufacturerServiceMock.Setup(service => service.GetByIdAsync(1)).ReturnsAsync((ManufacturerDTO)null);

            // Act
            var result = await _controller.Get(1);

            // Assert
            var actionResult = result as ActionResult<ManufacturerDTO>;
            Assert.IsNotNull(actionResult);
            var notFoundResult = actionResult.Result as NotFoundResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual((int)HttpStatusCode.NotFound, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task Get_ById_ShouldReturnOkResult_WithManufacturer()
        {
            // Arrange
            var manufacturer = new ManufacturerDTO { ManufacturerId = 1, ManufacturerName = "Test Manufacturer 1" };
            _manufacturerServiceMock.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(manufacturer);

            // Act
            var result = await _controller.Get(1);

            // Assert
            var actionResult = result as ActionResult<ManufacturerDTO>;
            Assert.IsNotNull(actionResult);
            var okResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual((int)HttpStatusCode.OK, okResult.StatusCode);
            var resultValue = okResult.Value as ManufacturerDTO;
            Assert.AreEqual(manufacturer, resultValue);
        }

        [TestMethod]
        public async Task Post_ShouldReturnCreatedAtAction_WhenManufacturerIsCreated()
        {
            // Arrange
            var manufacturer = new ManufacturerDTO { ManufacturerId = 1, ManufacturerName = "Test Manufacturer 1" };
            _manufacturerServiceMock.Setup(service => service.AddAsync(manufacturer)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Post(manufacturer);

            // Assert
            var createdAtActionResult = result as CreatedAtActionResult;
            Assert.IsNotNull(createdAtActionResult);
            Assert.AreEqual((int)HttpStatusCode.Created, createdAtActionResult.StatusCode);
            Assert.AreEqual("Get", createdAtActionResult.ActionName);
            Assert.AreEqual(1, createdAtActionResult.RouteValues["id"]);
            var resultValue = createdAtActionResult.Value as ManufacturerDTO;
            Assert.AreEqual(manufacturer, resultValue);
        }

        [TestMethod]
        public async Task Delete_ShouldReturnNoContent_WhenManufacturerIsDeleted()
        {
            // Arrange
            var manufacturer = new ManufacturerDTO { ManufacturerId = 1, ManufacturerName = "Test Manufacturer 1" };
            _manufacturerServiceMock.Setup(service => service.GetByIdAsync(1)).ReturnsAsync(manufacturer);
            _manufacturerServiceMock.Setup(service => service.DeleteAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.IsNotNull(noContentResult);
            Assert.AreEqual((int)HttpStatusCode.NoContent, noContentResult.StatusCode);
        }

        [TestMethod]
        public async Task Delete_ShouldReturnNotFound_WhenManufacturerDoesNotExist()
        {
            // Arrange
            _manufacturerServiceMock.Setup(service => service.GetByIdAsync(1)).ReturnsAsync((ManufacturerDTO)null);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            var notFoundResult = result as NotFoundResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual((int)HttpStatusCode.NotFound, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task GetAllVendorsAsync_ShouldReturnOkResult_WithListOfVendors()
        {
            // Arrange
            var vendors = new List<VendorDetails>
    {
        new VendorDetails { VendorId = 1, BusinessName = "Vendor 1" },
        new VendorDetails { VendorId = 2, BusinessName = "Vendor 2" }
    };

            var json = JsonConvert.SerializeObject(vendors);
            var responseMessage = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json)
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage)
                .Verifiable();

            // Act
            var result = await _controller.GetAllVendorsAsync();

            // Assert
            var actionResult = result as ActionResult<IEnumerable<VendorDetails>>;
            Assert.IsNotNull(actionResult);
            var okResult = actionResult.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual((int)HttpStatusCode.OK, okResult.StatusCode);

            var resultValue = okResult.Value as List<VendorDetails>;
            Assert.IsNotNull(resultValue);
            Assert.AreEqual(vendors.Count, resultValue.Count);

            for (int i = 0; i < vendors.Count; i++)
            {
                var expected = vendors[i];
                var actual = resultValue[i];

                Console.WriteLine($"Expected: {JsonConvert.SerializeObject(expected)}");
                Console.WriteLine($"Actual: {JsonConvert.SerializeObject(actual)}");

            }
        }
    }
}