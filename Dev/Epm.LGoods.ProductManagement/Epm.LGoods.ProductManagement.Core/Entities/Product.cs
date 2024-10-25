using System;
using System.ComponentModel.DataAnnotations;

namespace Epm.LGoods.ProductManagement.Core.Entities
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Product name is required *")]
        [StringLength(50, ErrorMessage = "Product name cannot exceed 50 characters")]
        public string ProductName { get; set; }

        [Required(ErrorMessage = "Product type is required *")]
        public string ProductType { get; set; }

        [Required(ErrorMessage = "Short description is required *")]
        [StringLength(500, ErrorMessage = "Short description cannot exceed 500 characters")]
        public string ShortDescription { get; set; }

        [DataType(DataType.Date)]
        public DateTime? MfgDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? ExpiryDate { get; set; }

        [Required(ErrorMessage = "Country of origin is required *")]
        public string CountryOfOrigin { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be a positive number.")]
        public int? StockQuantity { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Weight must be a positive number.")]
        public double? Weight { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Length must be a positive number.")]
        public double? Length { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Width must be a positive number.")]
        public double? Width { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Height must be a positive number.")]
        public double? Height { get; set; }

        

    }
}
