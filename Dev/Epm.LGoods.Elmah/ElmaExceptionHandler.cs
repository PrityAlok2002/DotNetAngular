using ElmahCore;
using ElmahCore.Mvc;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Epm.LGoods.Elmah
{
    public static class ElmaExceptionHandler
    {
        public static IServiceCollection AddElmahLogging(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddElmah<XmlFileErrorLog>(options =>
            {
                options.LogPath = configuration["Elmah:LogPath"];
            });

            return services;
        }

        public static IApplicationBuilder UseElmahLogging(this IApplicationBuilder app, IConfiguration configuration)
        {
            app.UseMiddleware<BasicAuthMiddleware>(configuration);
            app.UseElmah();

            return app;
        }
    }
}



