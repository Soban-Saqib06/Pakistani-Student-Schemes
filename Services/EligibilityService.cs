using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Extensions;
using PersonalProject.Models;

namespace PersonalProject.Services;

public class EligibilityService : IEligibilityService
{
    private readonly AppDbContext _context;

    public EligibilityService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EligibilityResponseDto>> GetAllCategoriesAsync()
    {
        return await _context.Eligibilities
            .ProjectToDto()
            .ToListAsync();
    }

    public async Task<EligibilityResponseDto?> GetCategoryByIdAsync(int id)
    {
        return await _context.Eligibilities
            .Where(e => e.Id == id)
            .ProjectToDto()
            .FirstOrDefaultAsync();
    }

    public async Task<EligibilityResponseDto?> CreateCategoryAsync(EligibilityCreationDto dto)
    {
        var normalizedName = dto.Name.Trim();
        var exists = await _context.Eligibilities
            .AnyAsync(e => e.Name.ToLower() == normalizedName.ToLower());

        if (exists)
        {
            return null;
        }

        var eligibility = new Eligibility
        {
            Name = normalizedName
        };

        await _context.Eligibilities.AddAsync(eligibility);
        await _context.SaveChangesAsync();

        return eligibility.ToDto();
    }
}
