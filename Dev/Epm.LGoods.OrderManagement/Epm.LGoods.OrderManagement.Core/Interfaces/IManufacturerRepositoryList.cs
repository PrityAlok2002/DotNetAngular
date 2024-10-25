using Epm.LGoods.OrderManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Interfaces
{
    public interface IManufacturerRepositoryList
    {
        Task<IEnumerable<ManufacturerDetails>> GetAllAsync();
        Task<ManufacturerDetails> GetByIdAsync(int id);
        Task<ManufacturerDetails> AddAsync(ManufacturerDetails manufacturer);
        Task UpdateAsync(ManufacturerDetails manufacturer);
        Task DeleteAsync(ManufacturerDetails manufacturer);
    }
}
