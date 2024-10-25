using Epm.LGoods.IdentityService.Application.Dtos;
using Epm.LGoods.IdentityService.Application.Services;
using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.IdentityService.Test
{
    [TestClass]
    public class RegistrationServiceTest
    {
        private ApplicationDbContext _context;
        private RegistrationService _service;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);
            _service = new RegistrationService(_context);
        }

        [TestMethod]
        public async Task RegisterUserAsync_ValidDto_SuccessfullyRegistersUser()
        {
            
            var registrationDto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "P@ssw0rd",
                MobileNumber = "1234567890",
                AccountType = "User"
            };

            
            await _service.RegisterUserAsync(registrationDto);

            
            var user = _context.Users.SingleOrDefault(u => u.Email == "john.doe@example.com");
            Assert.IsNotNull(user);
            Assert.AreEqual("John", user.FirstName);
            Assert.AreEqual("Doe", user.LastName);
            Assert.AreEqual("P@ssw0rd", user.Password);
            Assert.AreEqual("1234567890", user.MobileNumber);
            Assert.AreEqual("User", user.AccountType);
        }

        [TestMethod]
        public async Task RegisterUserAsync_VendorDto_SuccessfullyRegistersVendor()
        {
           
            var registrationDto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "P@ssw0rd",
                MobileNumber = "1234567890",
                AccountType = "Vendor",
                BusinessName = "Vendor Inc.",
                City = "Cityville",
                State = "State",
                ZipCode = "123456"
            };

            
            await _service.RegisterUserAsync(registrationDto);

            // Assert
            var user = _context.Users.SingleOrDefault(u => u.Email == "john.doe@example.com");
            Assert.IsNotNull(user);

            var vendorDetails = _context.VendorDetails.SingleOrDefault(v => v.UserId == user.UserId);
            Assert.IsNotNull(vendorDetails);
            Assert.AreEqual("Vendor Inc.", vendorDetails.BusinessName);
            Assert.AreEqual("Cityville", vendorDetails.City);
            Assert.AreEqual("State", vendorDetails.State);
            Assert.AreEqual("123456", vendorDetails.Zipcode);
            Assert.AreEqual("pending", vendorDetails.Status);
        }

        [TestMethod]
        public async Task CheckEmailExistsAsync_ShouldReturnTrue_WhenEmailExists()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                AccountType = "Admin", // assuming AccountType is a string
                FirstName = "John",
                LastName = "Doe",
                MobileNumber = "1234567890",
                Password = "Password123!" // make sure this meets your password policy
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.CheckEmailExistsAsync("test@example.com");

            // Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public async Task CheckEmailExistsAsync_ShouldReturnFalse_WhenEmailDoesNotExist()
        {
            // Arrange
            var user = new User
            {
                Email = "test@example.com",
                AccountType = "Admin", // assuming AccountType is a string
                FirstName = "John",
                LastName = "Doe",
                MobileNumber = "1234567890",
                Password = "Password123!" // make sure this meets your password policy
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.CheckEmailExistsAsync("nonexistent@example.com");

            // Assert
            Assert.IsFalse(result);
        }

        [TestMethod]
        public async Task CheckEmailExistsAsync_ShouldReturnFalse_WhenDatabaseIsEmpty()
        {
            // Act
            var result = await _service.CheckEmailExistsAsync("test@example.com");

            // Assert
            Assert.IsFalse(result);
        }
    }
}
