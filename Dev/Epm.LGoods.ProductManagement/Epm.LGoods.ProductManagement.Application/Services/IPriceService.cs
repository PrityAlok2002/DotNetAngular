using Epm.LGoods.ProductManagement.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public interface IPriceService
    {
        Task AddPriceAsync(PriceDto priceDto);
        Task<PriceDto> GetPriceByIdAsync(int id);
    
        Task UpdatePriceAsync(int id, PriceDto priceDto);
       
    }
}
