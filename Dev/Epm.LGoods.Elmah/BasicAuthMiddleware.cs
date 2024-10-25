using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Epm.LGoods.Elmah
{
    public class BasicAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public BasicAuthMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/elmah") || context.Request.Path.StartsWithSegments("/Logs"))
            {
                string authHeader = context.Request.Headers["Authorization"];
                if (authHeader != null && authHeader.StartsWith("Basic"))
                {
                    var encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
                    var decodedUsernamePassword = Encoding.UTF8.GetString(Convert.FromBase64String(encodedUsernamePassword));
                    var parts = decodedUsernamePassword.Split(':');
                    var username = parts[0];
                    var password = parts[1];

                    var validUsername = _configuration["BasicAuth:Username"];
                    var validPassword = _configuration["BasicAuth:Password"];

                    if (username == validUsername && password == validPassword)
                    {
                        await _next(context);
                        return;
                    }
                }

                // If unauthorized, render a custom HTML page
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "text/html";
                await RenderUnauthorizedPage(context.Response);
                return;
            }

            await _next(context);
        }

        private async Task RenderUnauthorizedPage(HttpResponse response)
        {
            await response.WriteAsync("<html>");
            await response.WriteAsync("<head>");
            await response.WriteAsync("<style>");
            await response.WriteAsync(@"
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f7f7f7;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    color: #333;
                }
                .header, .footer {
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    padding: 10px 20px;
                }
                .header {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                }
                .footer {
                    margin-top: auto;
                    padding: 20px;
                }
                .container {
                    text-align: center;
                    background: #fff;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    max-width: 400px;
                    width: 100%;
                    margin: 100px auto 20px;
                    opacity: 0;
                    transform: translateY(-20px);
                    animation: fadeInUp 1s forwards;
                }
                .header h1, .footer p {
                    margin: 0;
                }
                .content {
                    font-size: 16px;
                    margin-bottom: 20px;
                }
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #ff6b6b;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    background-color: #ff4b4b;
                }
            ");
            await response.WriteAsync("</style>");
            await response.WriteAsync("</head>");
            await response.WriteAsync("<body>");

            // Header section
            await response.WriteAsync("<div class=\"header\">");
            await response.WriteAsync("<h1>Unauthorized Access</h1>");
            await response.WriteAsync("</div>");

            // Content section
            await response.WriteAsync("<div class=\"container\">");
            await response.WriteAsync("<div class=\"content\">");
            await response.WriteAsync("<p>You are not authorized to access this resource.</p>");
            await response.WriteAsync("<p>Please contact your administrator for assistance.</p>");
            await response.WriteAsync("</div>");
            await response.WriteAsync("<a href=\"/\" class=\"btn\">Go to Homepage</a>");
            await response.WriteAsync("</div>");

            // Footer section
            await response.WriteAsync("<div class=\"footer\">");
            await response.WriteAsync("<p>&copy; 2024 Epm.LGoods</p>");
            await response.WriteAsync("</div>");

            await response.WriteAsync("</body>");
            await response.WriteAsync("</html>");
        }
    }
}

