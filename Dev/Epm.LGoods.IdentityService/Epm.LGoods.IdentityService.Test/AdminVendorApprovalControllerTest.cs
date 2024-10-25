using Epm.LGoods.IdentityService.API.Controllers;
using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Application.Services;
using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Test
{
    [TestClass]
    public class AdminVendorApprovalControllerTests
    {
        private Mock<IVendorApprovalService> _mockVendorApprovalService;
        private AdminVendorApprovalController _controller;

        private Mock<IVendorDetailsRepository> _mockVendorDetailsRepository;
        private Mock<IUserRepository> _mockUserRepository;
        private Mock<IConfiguration> _mockConfiguration;
        private VendorApprovalService _service;

        [TestInitialize]
        public void Setup()
        {
            // Setup for controller tests
            _mockVendorApprovalService = new Mock<IVendorApprovalService>();
            _controller = new AdminVendorApprovalController(_mockVendorApprovalService.Object);

            // Setup for service tests
            _mockVendorDetailsRepository = new Mock<IVendorDetailsRepository>();
            _mockUserRepository = new Mock<IUserRepository>();
            _mockConfiguration = new Mock<IConfiguration>();
            _service = new VendorApprovalService(
                _mockVendorDetailsRepository.Object,
                _mockUserRepository.Object,
                _mockConfiguration.Object);
        }

        // Controller Tests

        [TestMethod]
        public void GetPendingVendors_ReturnsOkResultWithVendors()
        {
            // Arrange
            var expectedVendors = new List<VendorApprovalDto>
            {
                new VendorApprovalDto { VendorId = 1, BusinessName = "Test Vendor 1" },
                new VendorApprovalDto { VendorId = 2, BusinessName = "Test Vendor 2" }
            };
            _mockVendorApprovalService.Setup(s => s.GetPendingVendors()).Returns(expectedVendors);

            // Act
            var result = _controller.GetPendingVendors();

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);

            var returnedVendors = okResult.Value as IEnumerable<VendorApprovalDto>;
            Assert.IsNotNull(returnedVendors);
            Assert.AreEqual(expectedVendors.Count, returnedVendors.Count());
            CollectionAssert.AreEqual(expectedVendors, returnedVendors.ToList());
        }

        [TestMethod]
        public async Task ApproveVendor_ReturnsNoContent()
        {
            // Arrange
            int vendorId = 1;
            _mockVendorApprovalService.Setup(s => s.ApproveVendor(vendorId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.ApproveVendor(vendorId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
            _mockVendorApprovalService.Verify(s => s.ApproveVendor(vendorId), Times.Once);
        }

        [TestMethod]
        public async Task RejectVendor_ReturnsNoContent()
        {
            // Arrange
            int vendorId = 1;
            _mockVendorApprovalService.Setup(s => s.RejectVendor(vendorId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.RejectVendor(vendorId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
            _mockVendorApprovalService.Verify(s => s.RejectVendor(vendorId), Times.Once);
        }

        // Service Tests

        [TestMethod]
        public void GetPendingVendors_ReturnsPendingVendors()
        {
            // Arrange
            var pendingVendors = new List<VendorDetails>
            {
                new VendorDetails { VendorId = 1, BusinessName = "Vendor 1", Status = "pending", UserId = 1 },
                new VendorDetails { VendorId = 2, BusinessName = "Vendor 2", Status = "pending", UserId = 2 }
            };
            _mockVendorDetailsRepository.Setup(r => r.GetAll()).Returns(pendingVendors.AsQueryable());
            _mockUserRepository.Setup(r => r.GetById(It.IsAny<int>())).Returns(new User { FirstName = "John", LastName = "Doe", Email = "john@example.com" });

            // Act
            var result = _service.GetPendingVendors();

            // Assert
            Assert.AreEqual(2, result.Count());
            Assert.AreEqual("Vendor 1", result.First().BusinessName);
            Assert.AreEqual("pending", result.First().Status);
        }
    }
}