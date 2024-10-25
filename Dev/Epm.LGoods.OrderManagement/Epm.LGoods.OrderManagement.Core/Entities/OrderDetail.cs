using System.ComponentModel.DataAnnotations.Schema;

namespace Epm.LGoods.OrderManagement.Core.Entities
{
    public class OrderDetail
    {
        public int Id { get; set; }

        [ForeignKey("Customer")]
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentMethod { get; set; }

        public int OrderId { get; set; }

        public Product Product { get; set; }
    }
}