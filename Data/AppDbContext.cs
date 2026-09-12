using System.Runtime.Intrinsics.X86;
using Microsoft.EntityFrameworkCore;
using PersonalProject.Models;

namespace PersonalProject.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Scheme> Schemes => Set<Scheme>();
    public DbSet<Eligibility> Eligibilities => Set<Eligibility>();
    public DbSet<User> Users => Set<User>();
    public DbSet<SavedScheme> SavedSchemes => Set<SavedScheme>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Scheme>()
            .HasOne(s => s.Eligibility)
            .WithMany(e => e.Schemes)
            .HasForeignKey(s => s.EligibilityId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SavedScheme>()
            .HasKey(ss => new {ss.UserId, ss.SchemeId});
        
        modelBuilder.Entity<SavedScheme>()
            .HasOne(ss => ss.User)
            .WithMany(u => u.SavedSchemes)
            .HasForeignKey(ss => ss.UserId);

        modelBuilder.Entity<SavedScheme>()
            .HasOne(s => s.Scheme)
            .WithMany(s => s.SavedSchemes)
            .HasForeignKey(ss => ss.SchemeId);
    }
}