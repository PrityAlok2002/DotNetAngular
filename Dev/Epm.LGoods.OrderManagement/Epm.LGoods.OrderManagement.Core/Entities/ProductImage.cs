using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Entities
{
    public class ProductImage
    {
        [Key]
        public int ImageId { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public bool IsMain { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
