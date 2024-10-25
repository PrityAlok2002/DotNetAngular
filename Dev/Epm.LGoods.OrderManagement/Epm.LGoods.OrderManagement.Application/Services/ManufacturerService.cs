// Application/Services/ManufacturerService.cs
using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public class ManufacturerService : IManufacturerService
    {
        private readonly IManufacturerRepository _repository;

        public ManufacturerService(IManufacturerRepository repository)
        {
            _repository = repository;
        }

        public async Task<ManufacturerDTO> GetByIdAsync(int id)
        {
            var manufacturer = await _repository.GetByIdAsync(id);
            return MapToDTO(manufacturer);
        }

        public async Task<IEnumerable<ManufacturerDTO>> GetAllAsync()
        {
            var manufacturers = await _repository.GetAllAsync();
            return manufacturers.Select(MapToDTO);
        }

        public async Task AddAsync(ManufacturerDTO manufacturerDTO)
        {
            var manufacturer = MapToEntity(manufacturerDTO);
            await _repository.AddAsync(manufacturer);
        }

        public async Task UpdateAsync(ManufacturerDTO manufacturerDTO)
        {
            var manufacturer = MapToEntity(manufacturerDTO);
            await _repository.UpdateAsync(manufacturer);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        private ManufacturerDTO MapToDTO(ManufacturerDetails manufacturer)
        {
            if (manufacturer == null)
            {
                throw new ArgumentNullException(nameof(manufacturer), "ManufacturerDetails object is null.");
            }

            return new ManufacturerDTO
            {
                ManufacturerId = manufacturer.ManufacturerId,
                ManufacturerName = manufacturer.ManufacturerName,
                Description = manufacturer.Description,
                Discounts = manufacturer.Discounts,
                DisplayOrder = manufacturer.DisplayOrder,
                LimitedToVendors = manufacturer.LimitedToVendors,
                Published = manufacturer.Published,
                CreatedOn = manufacturer.CreatedOn
            };
        }

        private ManufacturerDetails MapToEntity(ManufacturerDTO manufacturerDTO)
        {
            if (manufacturerDTO == null)
            {
                throw new ArgumentNullException(nameof(manufacturerDTO), "ManufacturerDTO object is null.");
            }

            return new ManufacturerDetails
            {
                ManufacturerId = manufacturerDTO.ManufacturerId,
                ManufacturerName = manufacturerDTO.ManufacturerName,
                Description = manufacturerDTO.Description,
                Discounts = manufacturerDTO.Discounts,
                DisplayOrder = manufacturerDTO.DisplayOrder,
                LimitedToVendors = manufacturerDTO.LimitedToVendors,
                Published = manufacturerDTO.Published,
                CreatedOn = manufacturerDTO.CreatedOn
            };
        }

        public Task UpdateAsync(ManufacturerDetails manufacturerDetails)
        {
            throw new NotImplementedException();
        }
    }
}
