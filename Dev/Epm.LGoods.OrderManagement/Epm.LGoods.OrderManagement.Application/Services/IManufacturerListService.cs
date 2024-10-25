using Epm.LGoods.OrderManagement.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public interface IManufacturerListService
    {
        Task<IEnumerable<ManufacturerListDto>> GetAllManufacturersAsync();
        Task<ManufacturerListDto> GetManufacturerByIdAsync(int id);
        Task<ManufacturerListDto> UpdateManufacturerAsync(int id, ManufacturerListDto manufacturerDto);
        Task<bool> DeleteManufacturerAsync(int id);
    }
}

