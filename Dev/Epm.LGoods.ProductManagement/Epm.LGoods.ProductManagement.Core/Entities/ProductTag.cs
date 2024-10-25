using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Entities
{
    public class ProductTag
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Product")]
        public int ProductId { get; set; } // Foreign key field
        public Product Product { get; set; }

        [ForeignKey("Tag")]
        public int TagId { get; set; }

        public Tag Tag { get; set; }


    }
}
