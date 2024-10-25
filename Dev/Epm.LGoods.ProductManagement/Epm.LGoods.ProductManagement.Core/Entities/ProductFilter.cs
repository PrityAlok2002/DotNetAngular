using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Entities
{
    public class ProductFilter
    {
        public string? ProductName { get; set; }
        public string? ProductType { get; set; }
        public string? CountryOfOrigin { get; set; }
    }
}
