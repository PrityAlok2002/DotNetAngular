using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.ProductManagement.Core.Entities
{
    public class Inventory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Minimum Cart Quantity must be a positive number.")]
        public int MinimumCartQuantity { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Maximum Cart Quantity must be a positive number.")]
        public int MaximumCartQuantity { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity Step must be a positive number.")]
        public int QuantityStep { get; set; }
    }
}
