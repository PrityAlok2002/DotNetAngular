using Epm.LGoods.ProductManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Interfaces
{
    public interface IPriceRepository
    {
        Task AddPriceAsync(Price price);
        Task<Price> GetPriceByIdAsync(int id);
        Task UpdatePriceAsync(Price price);
       
    }
}
