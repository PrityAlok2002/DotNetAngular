using Epm.LGoods.OrderManagement.Application.Dtos;
using Epm.LGoods.OrderManagement.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Epm.LGoods.OrderManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailsService;

        public OrderDetailController(IOrderDetailService orderDetailsService)
        {
            _orderDetailsService = orderDetailsService;
        }

        // GET: api/orderdetails/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailDto>> GetOrderDetails(int id)
        {
            var orderDetails = await _orderDetailsService.GetOrderDetailsAsync(id);

            if (orderDetails == null)
            {
                return NotFound();
            }

            return Ok(orderDetails);
        }

        // GET: api/orderdetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetAllOrderDetails()
        {
            var orderDetailsList = await _orderDetailsService.GetAllOrderDetailsAsync();
            return Ok(orderDetailsList);
        }

        // PUT: api/orderdetails/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetails(int id, OrderDetailDto orderDetailsDto)
        {
            if (id != orderDetailsDto.OrderId)
            {
                return BadRequest("Order ID mismatch.");
            }

            var result = await _orderDetailsService.UpdateOrderDetailsAsync(orderDetailsDto);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}