using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models
{
    public class ProductData
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Category { get; set; }
        public decimal QuantityInStock { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal CostPrice { get; set; }
    }
}