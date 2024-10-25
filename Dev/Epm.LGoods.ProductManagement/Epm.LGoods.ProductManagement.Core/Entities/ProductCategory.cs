using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;

namespace Epm.LGoods.ProductManagement.Core.Entities
{
    public class ProductCategory
    {
        [Key]
        public int ProductCategoryid { get; set; }
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
    }

}


