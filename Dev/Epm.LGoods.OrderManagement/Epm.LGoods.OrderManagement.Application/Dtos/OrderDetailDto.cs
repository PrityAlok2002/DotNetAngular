using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Dtos
{
    public class OrderDetailDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public int OrderId { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DiscountedPrice { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentMethod { get; set; }

        // New properties for products
        public List<ProductDto> Products { get; set; }
    }

    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ShortDescription { get; set; }
        public int Quantity { get; set; }
        public decimal CostPrice { get; set; }

        // New properties for images
        public List<ProductImageDto> Images { get; set; }
    }

    public class ProductImageDto
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsMain { get; set; }
    }

}
