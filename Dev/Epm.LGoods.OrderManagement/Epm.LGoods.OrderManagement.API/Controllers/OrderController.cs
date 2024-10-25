using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // GET: api/orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _orderService.GetOrderAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }

        // PUT: api/orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto updateOrderStatusDto)
        {
            if (id != updateOrderStatusDto.OrderId)
            {
                return BadRequest("Order ID mismatch.");
            }

            var result = await _orderService.UpdateOrderStatusAsync(updateOrderStatusDto);

            if (!result)
            {
                return BadRequest("Invalid order ID or status transition.");
            }

            return NoContent();
        }




        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestOrder()
        {
            var latestOrderDto = await _orderService.GetLatestOrdersAsync();

            if (latestOrderDto == null)
            {
                return NotFound(); 
            }

            return Ok(latestOrderDto);
        }
    }
}
