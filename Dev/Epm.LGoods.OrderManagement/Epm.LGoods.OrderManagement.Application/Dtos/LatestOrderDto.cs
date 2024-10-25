using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Dtos
{
    public class LatestOrderDto
    {
        public int CustomerId { get; set; }
        public string PaymentMethod { get; set; }

        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }

    }
}
