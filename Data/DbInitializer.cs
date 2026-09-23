using Microsoft.EntityFrameworkCore;
using PersonalProject.Models;

namespace PersonalProject.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
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
            var admin = new User
            {
                Name = "admin",
                Email = "REDACTED",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}