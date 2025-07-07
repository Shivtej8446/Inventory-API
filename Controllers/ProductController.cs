using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;

namespace WebApplication4.Controllers
{
    public class ProductController : ApiController
    {

        // GET - Fetch all products
        [HttpGet]
        [Route("api/product/get")]
        public IHttpActionResult GetAllProducts()
        {
            List<ProductData> products = new List<ProductData>();

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "SELECT ProductId, ProductName, Category, QuantityInStock, UnitPrice, CostPrice FROM Products";
                    SqlCommand cmd = new SqlCommand(query, con);
                    con.Open();

                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        ProductData product = new ProductData
                        {
                            ProductID = Convert.ToInt32(reader["ProductId"]),
                            ProductName = reader["ProductName"].ToString(),
                            Category = reader["Category"].ToString(),
                            QuantityInStock = Convert.ToInt32(reader["QuantityInStock"]),
                            UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                            CostPrice = Convert.ToDecimal(reader["CostPrice"])
                        };

                        products.Add(product);
                    }
                }

                return Ok(products);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        //private string connectionString = "Server=[SG044\\SQL2019];Database=[TebiscoDB];Trusted_Connection=true";
        string connectionString = ConfigurationManager.ConnectionStrings["TebiscoDB"].ConnectionString;
        [HttpPost]
        [Route("api/product/post")]
        public IHttpActionResult PostProduct([FromBody] ProductData product)
        {
            if (product == null)
                return BadRequest("Product is null");

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "INSERT INTO Products (ProductName, Category, QuantityInStock, UnitPrice, CostPrice) " +
                                   "VALUES (@name, @category, @qty, @Unp, @Csp)";
                    SqlCommand cmd = new SqlCommand(query, con);


                    cmd.Parameters.AddWithValue("@name", product.ProductName);
                    cmd.Parameters.AddWithValue("@category", product.Category);
                    cmd.Parameters.AddWithValue("@qty", product.QuantityInStock);
                    cmd.Parameters.AddWithValue("@Unp", product.UnitPrice);
                    cmd.Parameters.AddWithValue("@Csp", product.CostPrice);

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return Ok(new
                {
                    Message = "Product inserted into SQL Server successfully.",
                    product
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error inserting product: " + ex.Message));
            }
        }

        // PUT - Full Update
        [HttpPut]
        [Route("api/product/put")]
        public IHttpActionResult PutProduct(int id, [FromBody] ProductData product)
        {
            if (product == null)
                return BadRequest("Product is null");

            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "UPDATE Products SET ProductName = @name, Category = @category, QuantityInStock = @qty,  UnitPrice = @Unp, CostPrice = @Csp WHERE ProductId = @id";
                    SqlCommand cmd = new SqlCommand(query, con);

                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@name", product.ProductName);
                    cmd.Parameters.AddWithValue("@category", product.Category);
                    cmd.Parameters.AddWithValue("@qty", product.QuantityInStock);
                    cmd.Parameters.AddWithValue("@Unp", product.UnitPrice);
                    cmd.Parameters.AddWithValue("@Csp", product.CostPrice);

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();

                    if (rows == 0)
                        return NotFound();

                    return Ok(new { Message = "✅ Product updated successfully.", product });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // DELETE
        [HttpDelete]
        [Route("api/product/{id}")]
        public IHttpActionResult DeleteProduct(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    string query = "DELETE FROM Products WHERE ProductId = @id";
                    SqlCommand cmd = new SqlCommand(query, con);

                    cmd.Parameters.AddWithValue("@id", id);

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();

                    if (rows == 0)
                        return NotFound();

                    return Ok(new { Message = "✅ Product deleted successfully." });
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}


