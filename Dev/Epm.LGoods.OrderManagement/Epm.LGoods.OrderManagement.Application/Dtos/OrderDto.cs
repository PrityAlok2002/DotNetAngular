using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
       public string HouseNo{ get; set; }
        public string Building { get; set; }
        public string Landmark { get; set; }
        public string AddressLabel { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime? DateShipped { get; set; }
        public DateTime? DateDelivered { get; set; }
        public string PaymentMethod { get; set; }   
    }

}
