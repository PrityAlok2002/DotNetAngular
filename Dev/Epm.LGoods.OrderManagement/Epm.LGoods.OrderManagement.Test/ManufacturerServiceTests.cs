
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Tests
{
    [TestClass]
    public class ManufacturerServiceTests
    {
        private ManufacturerService _service;
        private Mock<IManufacturerRepository> _repository;
        private ManufacturerDTO _manufacturerDTO;
        private ManufacturerDetails _manufacturer;

        [TestInitialize]
        public void Setup()
        {
            _repository = new Mock<IManufacturerRepository>();
            _service = new ManufacturerService(_repository.Object);

            _manufacturerDTO = new ManufacturerDTO
            {
                ManufacturerId = 1,
                ManufacturerName = "Test Manufacturer",
                Description = "Test Description",
                Discounts = 10,
                DisplayOrder = 1,
                LimitedToVendors = "true",
                Published = true,
                CreatedOn = DateTime.Now
            };

            _manufacturer = new ManufacturerDetails
            {
                ManufacturerId = 1,
                ManufacturerName = "Test Manufacturer",
                Description = "Test Description",
                Discounts = 10,
                DisplayOrder = 1,
                LimitedToVendors = "true",
                Published = true,
                CreatedOn = DateTime.Now
            };
        }

        [TestMethod]
        public async Task GetByIdAsync_ReturnsManufacturer()
        {
            _repository.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(_manufacturer);

            var manufacturer = await _service.GetByIdAsync(1);

            Assert.IsNotNull(manufacturer);
            Assert.AreEqual(manufacturer.ManufacturerName, _manufacturerDTO.ManufacturerName);
        }

        [TestMethod]
        public void GetByIdAsync_ShouldThrowExceptionWhenNull()
        {
            _repository.Setup(x => x.GetByIdAsync(1)).Returns(Task.FromResult(default(ManufacturerDetails)));

            Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _service.GetByIdAsync(1));
        }

        [TestMethod]
        public async Task AddAsync_ShouldCallRepositoryAddAsync()
        {
            _repository.Setup(x => x.AddAsync(It.IsAny<ManufacturerDetails>())).Verifiable();
            await _service.AddAsync(_manufacturerDTO);
            _repository.Verify();
        }

        [TestMethod]
        public async Task UpdateAsync_ShouldCallRepositoryUpdateAsync()
        {
            _repository.Setup(x => x.UpdateAsync(It.IsAny<ManufacturerDetails>())).Verifiable();
            await _service.UpdateAsync(_manufacturerDTO);
            _repository.Verify();
        }

        [TestMethod]
        public async Task DeleteAsync_ShouldCallRepositoryDeleteAsync()
        {
            _repository.Setup(x => x.DeleteAsync(1)).Verifiable();
            await _service.DeleteAsync(1);
            _repository.Verify();
        }
    }
}