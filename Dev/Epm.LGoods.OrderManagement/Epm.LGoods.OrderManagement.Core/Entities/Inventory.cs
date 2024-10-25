using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Entities
{
    public class Inventory
    {
        [Key]
        public int InventoryId { get; set; } // Primary key

        [ForeignKey("Product")]
        public int ProductId { get; set; } // Foreign key to Product

        public int MinimumCartQuantity { get; set; }
        public int MaximumCartQuantity { get; set; }
        public int QuantityStep { get; set; }

    }
}
