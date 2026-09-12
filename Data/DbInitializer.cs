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

        var schemes = new List<Scheme>
        {
            new Scheme
            {
                Title = "National Merit Scholarship",
                Description = "Tuition coverage for top-performing undergraduate students.",
                Deadline = DateTime.UtcNow.AddMonths(3),
                EligibilityId = underGrad.Id,
                Organization = "HEC",
                Province = "Punjab",
                ApplyUrl = "https://google.com"
            },
            new Scheme
            {
                Title = "Postgraduate Research Grant",
                Description = "Stipend support for full-time masters and doctoral research.",
                Deadline = DateTime.UtcNow.AddMonths(5),
                EligibilityId = postGrad.Id,
                Organization = "Government of Punjab",
                Province = "Punjab",
                ApplyUrl = "https://youtube.com"
            }
        };

        var admin = new User{
            Name = "admin",
            Email = "REDACTED",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
            };

        context.Schemes.AddRange(schemes);
        context.Users.Add(admin);
        context.SaveChanges();
    }
}