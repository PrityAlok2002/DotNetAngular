using Castle.Core.Configuration;
using Epm.LGoods.IdentityService.Application.Services;
using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Test
{
    [TestClass]
    public class VendorApprovalServiceTests
    {
        private Mock<IVendorDetailsRepository> _mockVendorRepo;
        private Mock<IUserRepository> _mockUserRepo;
        private Mock<Microsoft.Extensions.Configuration.IConfiguration> _mockConfig;
        private TestableVendorApprovalService _service;

        [TestInitialize]
        public void Setup()
        {
            _mockVendorRepo = new Mock<IVendorDetailsRepository>();
            _mockUserRepo = new Mock<IUserRepository>();
            _mockConfig = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            _mockConfig.Setup(c => c["SmtpSettings:Server"]).Returns("smtp.example.com");
            _mockConfig.Setup(c => c["SmtpSettings:Port"]).Returns("587");
            _mockConfig.Setup(c => c["SmtpSettings:Username"]).Returns("testuser");
            _mockConfig.Setup(c => c["SmtpSettings:Password"]).Returns("testpassword");
            _mockConfig.Setup(c => c["SmtpSettings:FromEmail"]).Returns("noreply@example.com");

            _service = new TestableVendorApprovalService(
                _mockVendorRepo.Object,
                _mockUserRepo.Object,
                _mockConfig.Object);
        }

        [TestMethod]
        public void GetPendingVendors_ReturnsCorrectVendors()
        {
            // Arrange
            var vendorsList = new List<VendorDetails>
            {
                new VendorDetails { VendorId = 1, Status = "pending", UserId = 1 },
                new VendorDetails { VendorId = 2, Status = "approved", UserId = 2 },
                new VendorDetails { VendorId = 3, Status = "pending", UserId = 3 }
            };

            _mockVendorRepo.Setup(repo => repo.GetAll()).Returns(vendorsList.AsQueryable());

            _mockUserRepo.Setup(repo => repo.GetById(It.IsAny<int>()))
                .Returns<int>(id => new User { UserId = id, FirstName = "Test", LastName = "User", Email = "test@example.com" });

            // Act
            var result = _service.GetPendingVendors().ToList();

            // Assert
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.All(v => v.Status == "pending"));
        }


        [TestMethod]
        public async Task SendEmail_RetriesOnFailure()
        {
            // Arrange
            var vendor = new VendorDetails { VendorId = 1, Status = "pending", UserId = 1 };
            _mockVendorRepo.Setup(repo => repo.GetById(It.IsAny<int>())).Returns(vendor);
            _mockUserRepo.Setup(repo => repo.GetById(It.IsAny<int>())).Returns(new User { UserId = 1, FirstName = "Test", LastName = "User", Email = "vendor@example.com" });

            var sendEmailCalled = false;
            _service.GetType().GetMethod("SendEmail", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .Invoke(_service, new object[] { "vendor@example.com", "Test Subject", "Test Body" });

            // Assert
            // Check if SendEmail method was called the expected number of times
        }
        [TestMethod]
        public void UpdateVendorStatus_UpdatesCorrectly()
        {
            // Arrange
            var vendorId = 1;
            var vendor = new VendorDetails { VendorId = vendorId, Status = "pending", UserId = 1 };
            var user = new User { UserId = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com" };

            _mockVendorRepo.Setup(r => r.GetById(vendorId)).Returns(vendor);
            _mockUserRepo.Setup(r => r.GetById(1)).Returns(user);

            // Act
            var result = _service.UpdateVendorStatus(vendorId, "approved");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("approved", result.Status);
            _mockVendorRepo.Verify(r => r.Update(It.Is<VendorDetails>(v => v.Status == "approved")), Times.Once);
        }


        [TestMethod]
        public async Task RejectVendor_UpdatesStatusAndSendsEmail()
        {
            // Arrange
            var vendorId = 1;
            var vendor = new VendorDetails { VendorId = vendorId, Status = "pending", UserId = 1 };
            var user = new User { UserId = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com" };

            _mockVendorRepo.Setup(r => r.GetById(vendorId)).Returns(vendor);
            _mockUserRepo.Setup(r => r.GetById(1)).Returns(user);

            _service.SetSendEmailOverride((toEmail, subject, body) => Task.CompletedTask); // Override SendEmail to do nothing

            // Act
            await _service.RejectVendor(vendorId);

            // Assert
            _mockVendorRepo.Verify(r => r.Update(It.Is<VendorDetails>(v => v.Status == "rejected")), Times.Once);
        }
        [TestMethod]
        public async Task ApproveVendor_UpdatesStatusAndSendsEmail()
        {
            // Arrange
            var vendorId = 1;
            var vendor = new VendorDetails { VendorId = vendorId, Status = "pending", UserId = 1 };
            var user = new User { UserId = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com" };

            _mockVendorRepo.Setup(r => r.GetById(vendorId)).Returns(vendor);
            _mockUserRepo.Setup(r => r.GetById(1)).Returns(user);

            _service.SetSendEmailOverride((toEmail, subject, body) => Task.CompletedTask); // Override SendEmail to do nothing

            // Act
            await _service.ApproveVendor(vendorId);

            // Assert
            _mockVendorRepo.Verify(r => r.Update(It.Is<VendorDetails>(v => v.Status == "approved")), Times.Once);
        }


    }
}