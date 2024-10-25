using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public interface IManufacturerService
    {
        Task<ManufacturerDTO> GetByIdAsync(int id);
        Task<IEnumerable<ManufacturerDTO>> GetAllAsync();
        Task AddAsync(ManufacturerDTO manufacturerDTO);
        Task UpdateAsync(ManufacturerDTO manufacturerDTO);
        Task DeleteAsync(int id);
        Task UpdateAsync(ManufacturerDetails manufacturerDetails);
    }
}
