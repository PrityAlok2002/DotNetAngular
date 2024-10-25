using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public class OrderDetailService : IOrderDetailService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IOrderItemRepository _orderItemRepository;
        private readonly IProductImageRepository _productImageRepository;

        public OrderDetailService(
            IOrderRepository orderRepository,
            ICustomerRepository customerRepository,
            IOrderItemRepository orderItemRepository,
            IProductImageRepository productImageRepository)
        {
            _orderRepository = orderRepository;
            _customerRepository = customerRepository;
            _orderItemRepository = orderItemRepository;
            _productImageRepository = productImageRepository;
        }

        public async Task<OrderDetailDto> GetOrderDetailsAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return null;

            var customer = await _customerRepository.GetByIdAsync(order.CustomerId);
            var orderItems = await _orderItemRepository.GetByOrderDetailsIdAsync(orderId);

            return await MapToOrderDetailsDtoAsync(order, customer, orderItems);
        }

        public async Task<IEnumerable<OrderDetailDto>> GetAllOrderDetailsAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            var orderDetailsDtos = new List<OrderDetailDto>();

            foreach (var order in orders)
            {
                var customer = await _customerRepository.GetByIdAsync(order.CustomerId);
                var orderItems = await _orderItemRepository.GetByOrderDetailsIdAsync(order.Id);

                orderDetailsDtos.Add(await MapToOrderDetailsDtoAsync(order, customer, orderItems));
            }

            return orderDetailsDtos;
        }

        private async Task<OrderDetailDto> MapToOrderDetailsDtoAsync(Order order, Customer customer, IEnumerable<OrderItem> orderItems)
        {
            var productDtos = new List<ProductDto>();

            foreach (var orderItem in orderItems)
            {
                var productImages = await _productImageRepository.GetImagesByProductIdAsync(orderItem.ProductId);
                var productDto = new ProductDto
                {
                    ProductId = orderItem.ProductId,
                    ProductName = orderItem.Product.ProductName,
                    ShortDescription = orderItem.Product.ShortDescription,
                    Quantity = orderItem.Quantity,
                    CostPrice = orderItem.CostPrice,
                    Images = productImages.Select(pi => new ProductImageDto
                    {
                        ImageId = pi.ImageId,
                        ImageUrl = pi.ImageUrl,
                        IsMain = pi.IsMain
                    }).ToList()
                };

                productDtos.Add(productDto);
            }

            return new OrderDetailDto
            {
                Id = order.Id,
                CustomerName = customer.Name,
                OrderId = order.Id,
                TotalAmount = order.TotalAmount,
                DeliveryFee = order.DeliveryFee,
                Tax = order.Tax,
                DiscountedPrice = orderItems.Sum(oi => oi.DiscountedPrice * oi.Quantity),
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus,
                PaymentMethod = order.PaymentMethod,
                Products = productDtos,
            };
        }

        public async Task<bool> UpdateOrderDetailsAsync(OrderDetailDto orderDetailsDto)
        {
            // Implementation for updating order details
            // Note: This method needs to be implemented as per your requirements
            return await Task.FromResult(true);
        }
    }
}
