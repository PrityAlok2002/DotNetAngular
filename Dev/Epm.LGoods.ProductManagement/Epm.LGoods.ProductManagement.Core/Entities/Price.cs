using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Epm.LGoods.ProductManagement.Core.Entities
{
    public class Price
    {
        [Key]
        public int PriceId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PriceAmount { get; set; }

        [Required]
        [StringLength(3)]
        public string Currency { get; set; }

        [Required]
        public int VendorId { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public int DiscountPercentage { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal EffectivePrice { get; set; }

    //    [ForeignKey("ProductId")]
    //    public Product Product { get; set; }

    //    [ForeignKey("VendorId")]
    //    public VendorDetails VendorDetails { get; set; }
    }
}
