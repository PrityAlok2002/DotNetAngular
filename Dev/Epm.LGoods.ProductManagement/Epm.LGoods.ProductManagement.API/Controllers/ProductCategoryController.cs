using Epm.LGoods.ProductManagement.Application.Dtos;
using Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Core.Entities.Epm.LGoods.ProductManagement.Core.Entities;
using Epm.LGoods.ProductManagement.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Epm.LGoods.ProductManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductCategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductCategory/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductCategory>> GetProductCategory(int id)
        {
            var productCategory = await _context.ProductCategories
                //.Include(pc => pc.Product)
                .FirstOrDefaultAsync(pc => pc.ProductCategoryid == id);

            if (productCategory == null)
            {
                return NotFound();
            }

            return productCategory;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            try
            {
                return Ok(await _context.Categories.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }



        [HttpPost("saveMappings")]
        public async Task<IActionResult> SaveMappings([FromBody] ProductCategory productCategory)
        {

            _context.ProductCategories.Add(productCategory);
            await _context.SaveChangesAsync();
            return Ok();
        }

        private bool ProductCategoryExists(int productId, int categoryId)
        {
            return _context.ProductCategories.Any(pc => pc.ProductId == productId && pc.CategoryId == categoryId);
        }


    }
}

