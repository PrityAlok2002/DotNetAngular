using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        [ForeignKey("Customer")]
        public int CustomerId { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public required string OrderStatus { get; set; }        //cancelled  delivered shipped
        public DateTime? DateShipped { get; set; }
        public DateTime? DateDelivered { get; set; }
        public int VendorID { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal Tax { get; set; }
        public string PaymentMethod { get; set; } //cash upi

        [ForeignKey("Address")]
        public int AddressId { get; set; }
    }
}
