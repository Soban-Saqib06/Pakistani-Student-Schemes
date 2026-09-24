using Microsoft.EntityFrameworkCore;
using PersonalProject.Models;

namespace PersonalProject.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context, Microsoft.Extensions.Configuration.IConfiguration config)
    {
        context.Database.Migrate();

        if (context.Eligibilities.Any() || context.Schemes.Any())
        {
            return;
        }

        var underGrad = new Eligibility { Name = "Undergraduate" };
        var postGrad = new Eligibility { Name = "Postgraduate" };

        context.Eligibilities.AddRange(underGrad, postGrad);
        context.SaveChanges();

        if (!context.Users.Any())
        {
            var adminEmail = config["AdminUser:Email"] ?? Environment.GetEnvironmentVariable("ADMIN_EMAIL");
            var adminPassword = config["AdminUser:Password"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

            if (!string.IsNullOrWhiteSpace(adminEmail) && !string.IsNullOrWhiteSpace(adminPassword))
            {
                var admin = new User
                {
                    Name = "admin",
                    Email = adminEmail,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                context.Users.Add(admin);
                context.SaveChanges();
            }
        }
    }
}