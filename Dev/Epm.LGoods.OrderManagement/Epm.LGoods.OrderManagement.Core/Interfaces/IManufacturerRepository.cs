using Epm.LGoods.OrderManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Interfaces
{
    public interface IManufacturerRepository
    {
        Task<ManufacturerDetails> GetByIdAsync(int id);
        Task<IEnumerable<ManufacturerDetails>> GetAllAsync();
        Task AddAsync(ManufacturerDetails manufacturer);
        Task UpdateAsync(ManufacturerDetails manufacturer);
        Task DeleteAsync(int id);

    }
}
