using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Core.Entities;
using Epm.LGoods.OrderManagement.Core.Interfaces;
using Epm.LGoods.OrderManagement.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customerRepository;
       private readonly IAddressRepository _addressRepository;

        public OrderService(IOrderRepository orderRepository, ICustomerRepository customerRepository, IAddressRepository addressRepository)
        {
            _orderRepository = orderRepository;
            _customerRepository = customerRepository;
            _addressRepository = addressRepository;
            _addressRepository = addressRepository;
        }

        public async Task<OrderDto> GetOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                return null;

            var customer = await _customerRepository.GetByIdAsync(order.CustomerId);
            var address = await _addressRepository.GetByIdAsync(order.AddressId); // Use CustomerId to fetch address

            return MapToOrderDto(order, customer,address);
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            var orderDtos = new List<OrderDto>();

            foreach (var order in orders)
            {
                var customer = await _customerRepository.GetByIdAsync(order.CustomerId);
                var address = await _addressRepository.GetByIdAsync(order.AddressId); // Use CustomerId to fetch address
                orderDtos.Add(MapToOrderDto(order, customer,address));
            }

            return orderDtos;
        }

        public async Task<bool> UpdateOrderStatusAsync(UpdateOrderStatusDto updateOrderStatusDto)
        {
            // Fetch the order by its ID
            var order = await _orderRepository.GetByIdAsync(updateOrderStatusDto.OrderId);

            // Check if the order exists
            if (order == null)
            {
                return false;
            }

            // Validate the status transition
            if (!IsValidStatusTransition(order.OrderStatus, updateOrderStatusDto.NewStatus))
            {
                return false;
            }

            // Update the order status
            order.OrderStatus = updateOrderStatusDto.NewStatus;

            // Update the relevant date fields based on the new status
            if (updateOrderStatusDto.NewStatus == "Shipped")
            {
                order.DateShipped = DateTime.UtcNow;
            }
            else if (updateOrderStatusDto.NewStatus == "Delivered")
            {
                order.DateDelivered = DateTime.UtcNow;
            }

            // Persist the updated order
            await _orderRepository.UpdateAsync(order);

            return true;
        }

        private bool IsValidStatusTransition(string currentStatus, string newStatus)
        {
            return (currentStatus, newStatus) switch
            {
                ("Pending", "Cancelled") => true,
                ("Pending", "Shipped") => true,
                ("Shipped", "Delivered") => true,
                ("Delivered", "Completed") => true,
                _ => false
            };
        }

        private OrderDto MapToOrderDto(Order order, Customer customer,Address address)
        {
            return new OrderDto
            {
                Id = order.Id,
                CustomerName = customer.Name,
                CustomerPhone = customer.PhoneNumber,
                HouseNo= address.HouseNo,
                Building=address.Building ,
                Landmark=address.Landmark,
                AddressLabel=address.AddressLabel,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus,
                TotalAmount = order.TotalAmount,
                PaymentMethod = order.PaymentMethod,
                DateShipped = order.DateShipped,
                DateDelivered = order.DateDelivered
            };
        }


        public async Task<List<LatestOrderDto>> GetLatestOrdersAsync()
        {
            var orders = await _orderRepository.GetLatestOrdersAsync();

            return orders.Select(order => new LatestOrderDto
            {
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                PaymentMethod = order.PaymentMethod,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus
            }).ToList();
        }

    }
}
