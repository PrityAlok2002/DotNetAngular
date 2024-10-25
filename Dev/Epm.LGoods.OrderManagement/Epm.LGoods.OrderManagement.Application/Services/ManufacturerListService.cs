using Epm.LGoods.OrderManagement.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public class ManufacturerListService : IManufacturerListService
    {
        private readonly IManufacturerRepositoryList _manufacturerRepository;

        public ManufacturerListService(IManufacturerRepositoryList manufacturerRepository)
        {
            _manufacturerRepository = manufacturerRepository;
        }

        public async Task<IEnumerable<ManufacturerListDto>> GetAllManufacturersAsync()
        {
            var manufacturers = await _manufacturerRepository.GetAllAsync();
            return manufacturers.Select(m => new ManufacturerListDto
            {
                ManufacturerId = m.ManufacturerId,
                ManufacturerName = m.ManufacturerName,
                Published = m.Published,
                DisplayOrder = m.DisplayOrder,
                LimitedToVendors = m.LimitedToVendors,
                CreatedOn = m.CreatedOn
            });
        }

        public async Task<ManufacturerListDto> GetManufacturerByIdAsync(int id)
        {
            var manufacturer = await _manufacturerRepository.GetByIdAsync(id);
            if (manufacturer == null)
                return null;

            return new ManufacturerListDto
            {
                ManufacturerId = manufacturer.ManufacturerId,
                ManufacturerName = manufacturer.ManufacturerName,
                Published = manufacturer.Published,
                DisplayOrder = manufacturer.DisplayOrder,
                LimitedToVendors = manufacturer.LimitedToVendors,
                CreatedOn = manufacturer.CreatedOn
            };
        }

        public async Task<ManufacturerListDto> UpdateManufacturerAsync(int id, ManufacturerListDto manufacturerDto)
        {
            var manufacturer = await _manufacturerRepository.GetByIdAsync(id);
            if (manufacturer == null)
                return null;

            manufacturer.ManufacturerName = manufacturerDto.ManufacturerName;
            manufacturer.Published = manufacturerDto.Published;
            manufacturer.DisplayOrder = manufacturerDto.DisplayOrder;
            manufacturer.LimitedToVendors = manufacturerDto.LimitedToVendors;
            manufacturer.CreatedOn = manufacturerDto.CreatedOn;

            await _manufacturerRepository.UpdateAsync(manufacturer);

            return manufacturerDto;
        }

        public async Task<bool> DeleteManufacturerAsync(int id)
        {
            var manufacturer = await _manufacturerRepository.GetByIdAsync(id);
            if (manufacturer == null)
                return false;

            await _manufacturerRepository.DeleteAsync(manufacturer);

            return true;
        }
    }
}

