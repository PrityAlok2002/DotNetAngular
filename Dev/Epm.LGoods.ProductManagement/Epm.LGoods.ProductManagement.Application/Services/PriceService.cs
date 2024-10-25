using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Interfaces;

namespace Epm.LGoods.ProductManagement.Application.Services
{
    public class PriceService : IPriceService
    {
        private readonly IPriceRepository _priceRepository;

        public PriceService(IPriceRepository priceRepository)
        {
            _priceRepository = priceRepository;
        }

        public async Task AddPriceAsync(PriceDto priceDto)
        {

            var price = new Price
            {
                ProductId = priceDto.ProductId,
                PriceAmount = priceDto.PriceAmount,
                Currency = priceDto.Currency,
                VendorId = priceDto.VendorId,
                DiscountPercentage = priceDto.DiscountPercentage,
                EffectivePrice = priceDto.PriceAmount - (priceDto.PriceAmount * priceDto.DiscountPercentage / 100)
            };

            await _priceRepository.AddPriceAsync(price);
        }

        public async Task<PriceDto> GetPriceByIdAsync(int id)
        {
            var price = await _priceRepository.GetPriceByIdAsync(id);
            if (price == null) return null;

            return new PriceDto
            {
                ProductId = price.ProductId,
                PriceAmount = price.PriceAmount,
                Currency = price.Currency,
                VendorId = price.VendorId,
                DiscountPercentage = price.DiscountPercentage,
                EffectivePrice = price.EffectivePrice
            };
        }

       

        public async Task UpdatePriceAsync(int id, PriceDto priceDto)
        {
            var price = await _priceRepository.GetPriceByIdAsync(id);
            if (price == null) return;

            price.PriceAmount = priceDto.PriceAmount;
            price.Currency = priceDto.Currency;
            price.VendorId = priceDto.VendorId;
            price.DiscountPercentage = priceDto.DiscountPercentage;
            price.EffectivePrice = priceDto.PriceAmount - (priceDto.PriceAmount * priceDto.DiscountPercentage / 100);

            await _priceRepository.UpdatePriceAsync(price);
        }

        
    }
}
