using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Application.Dtos
{
    public class PriceDto
    {
        public int ProductId { get; set; }
        public decimal PriceAmount { get; set; }
        public string Currency { get; set; }
        public int VendorId { get; set; }
        public int DiscountPercentage { get; set; }
        public decimal EffectivePrice { get; set; }
    }
}
