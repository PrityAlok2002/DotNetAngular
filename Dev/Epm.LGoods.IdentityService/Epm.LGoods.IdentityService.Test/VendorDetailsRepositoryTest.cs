using Epm.LGoods.IdentityService.Core.Entities;
using Epm.LGoods.IdentityService.Infrastructure.Data;
using Epm.LGoods.IdentityService.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;

namespace Epm.LGoods.IdentityService.Test.Repositories
{
    [TestClass]
    public class VendorDetailsRepositoryTest
    {
        private ApplicationDbContext _context;
        private VendorDetailsRepository _vendorDetailsRepository;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new ApplicationDbContext(options);
            _vendorDetailsRepository = new VendorDetailsRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [TestMethod]
        public void AddVendorDetails_ShouldAddVendorDetails()
        {
            var vendorDetails = new VendorDetails
            {
                BusinessName = "Test Business",
                City = "Test City",
                State = "Test State",
                Zipcode = "123456",
                Status = "Pending",
                RegistrationDate = DateTime.Now,
                UserId = 1
            };

            _vendorDetailsRepository.Add(vendorDetails);

            var addedVendorDetails = _context.VendorDetails.FirstOrDefault(v => v.BusinessName == "Test Business");
            Assert.IsNotNull(addedVendorDetails);
            Assert.AreEqual("Test Business", addedVendorDetails.BusinessName);
        }

        [TestMethod]
        public void GetAll_ShouldReturnAllVendorDetails()
        {
            var vendorDetails1 = new VendorDetails
            {
                BusinessName = "Test Business 1",
                City = "Test City 1",
                State = "Test State 1",
                Zipcode = "123456",
                Status = "Pending",
                RegistrationDate = DateTime.Now,
                UserId = 1
            };

            var vendorDetails2 = new VendorDetails
            {
                BusinessName = "Test Business 2",
                City = "Test City 2",
                State = "Test State 2",
                Zipcode = "654321",
                Status = "Approved",
                RegistrationDate = DateTime.Now,
                UserId = 2
            };

            _vendorDetailsRepository.Add(vendorDetails1);
            _vendorDetailsRepository.Add(vendorDetails2);

            var vendorDetailsList = _vendorDetailsRepository.GetAll().ToList();

            Assert.AreEqual(2, vendorDetailsList.Count);
            Assert.IsTrue(vendorDetailsList.Any(v => v.BusinessName == "Test Business 1"));
            Assert.IsTrue(vendorDetailsList.Any(v => v.BusinessName == "Test Business 2"));
        }

        [TestMethod]
        public void GetById_ShouldReturnVendorDetails()
        {
            var vendorDetails = new VendorDetails
            {
                BusinessName = "Test Business",
                City = "Test City",
                State = "Test State",
                Zipcode = "123456",
                Status = "Pending",
                RegistrationDate = DateTime.Now,
                UserId = 1
            };

            _vendorDetailsRepository.Add(vendorDetails);
            var addedVendorDetails = _context.VendorDetails.FirstOrDefault(v => v.BusinessName == "Test Business");

            var foundVendorDetails = _vendorDetailsRepository.GetById(addedVendorDetails.VendorId);

            Assert.IsNotNull(foundVendorDetails);
            Assert.AreEqual("Test Business", foundVendorDetails.BusinessName);
        }

        [TestMethod]
        public void UpdateVendorDetails_ShouldUpdateVendorDetails()
        {
            var vendorDetails = new VendorDetails
            {
                BusinessName = "Test Business",
                City = "Test City",
                State = "Test State",
                Zipcode = "123456",
                Status = "Pending",
                RegistrationDate = DateTime.Now,
                UserId = 1
            };

            _vendorDetailsRepository.Add(vendorDetails);
            var addedVendorDetails = _context.VendorDetails.FirstOrDefault(v => v.BusinessName == "Test Business");

            addedVendorDetails.Status = "Approved";
            _vendorDetailsRepository.Update(addedVendorDetails);

            var updatedVendorDetails = _context.VendorDetails.FirstOrDefault(v => v.BusinessName == "Test Business");
            Assert.AreEqual("Approved", updatedVendorDetails.Status);
        }

        [TestMethod]
        public void DeleteVendorDetails_ShouldRemoveVendorDetails()
        {
            var vendorDetails = new VendorDetails
            {
                BusinessName = "Test Business",
                City = "Test City",
                State = "Test State",
                Zipcode = "123456",
                Status = "Pending",
                RegistrationDate = DateTime.Now,
                UserId = 1
            };

            _vendorDetailsRepository.Add(vendorDetails);
            var addedVendorDetails = _context.VendorDetails.FirstOrDefault(v => v.BusinessName == "Test Business");

            _vendorDetailsRepository.Delete(addedVendorDetails);

            var deletedVendorDetails = _context.VendorDetails.FirstOrDefault(v => v.BusinessName == "Test Business");
            Assert.IsNull(deletedVendorDetails);
        }
    }
}
