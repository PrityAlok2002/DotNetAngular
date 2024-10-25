using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Threading.Tasks;
using Epm.LGoods.IdentityService.API.Controllers;
using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Epm.LGoods.IdentityService.Tests.Controllers
{
    [TestClass]
    public class RegistrationControllerTests
    {
        private Mock<IRegistrationService> _mockRegistrationService;
        private RegistrationController _controller;

        [TestInitialize]
        public void Setup()
        {
            _mockRegistrationService = new Mock<IRegistrationService>();
            _controller = new RegistrationController(_mockRegistrationService.Object);
        }

        [TestMethod]
        public async Task Register_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            var registrationDto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "P@ssword123",
                MobileNumber = "1234567890",
                AccountType = "Vendor"
            };

            _mockRegistrationService
                .Setup(service => service.RegisterUserAsync(It.IsAny<RegistrationDto>()))
                .ThrowsAsync(new Exception("Registration failed"));

            // Act
            var result = await _controller.Register(registrationDto);

            // Assert
            var objectResult = result as ObjectResult;
            Assert.IsNotNull(objectResult);
            Assert.AreEqual(500, objectResult.StatusCode);
            Assert.AreEqual("Registration failed", objectResult.Value);
        }


        [TestMethod]
        public async Task Register_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            var registrationDto = new RegistrationDto
            {
                // Initialize the properties of the DTO with invalid data
                FirstName = "", // Invalid because it is required
                LastName = "",
                Email = "invalid-email", // Invalid email format
                Password = "short", // Invalid because it is too short
                MobileNumber = "invalid", // Invalid format
                AccountType = "InvalidType" // Invalid because it is not a recognized account type
            };

            _controller.ModelState.AddModelError("FirstName", "Required");
            _controller.ModelState.AddModelError("Email", "Invalid email format");
            _controller.ModelState.AddModelError("Password", "Password must be at least 8 characters long");
            _controller.ModelState.AddModelError("MobileNumber", "Invalid mobile number");

            // Act
            var result = await _controller.Register(registrationDto);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.IsInstanceOfType(badRequestResult.Value, typeof(SerializableError));
        }

        [TestMethod]
        public async Task CheckEmailExists_ShouldReturnTrue_WhenEmailExists()
        {
            // Arrange
            string email = "test@example.com";
            _mockRegistrationService.Setup(service => service.CheckEmailExistsAsync(email))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.CheckEmailExists(email) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.IsTrue((bool)result.Value);
        }

        [TestMethod]
        public async Task CheckEmailExists_ShouldReturnFalse_WhenEmailDoesNotExist()
        {
            // Arrange
            string email = "test@example.com";
            _mockRegistrationService.Setup(service => service.CheckEmailExistsAsync(email))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.CheckEmailExists(email) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(200, result.StatusCode);
            Assert.IsFalse((bool)result.Value);
        }
    }
}

