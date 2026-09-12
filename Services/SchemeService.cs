using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Extensions;
using PersonalProject.Models;

namespace PersonalProject.Services;

public class SchemeService : ISchemeService
{
    private readonly AppDbContext _context;

    public SchemeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Wrapper> GetSchemesAsync(int pageNumber, int pageSize)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 10;

        var totalCount = await _context.Schemes.CountAsync();

        var schemes = await _context.Schemes
            .Include(s => s.Eligibility)
            .ProjectToDto()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new Wrapper
        {
            TotalCount = totalCount,
            pageSize = pageSize,
            pageNumber = pageNumber,
            totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            Schemes = schemes
        };
    }

    public async Task<SchemeResponseDto?> GetSchemeByIdAsync(int id)
    {
        return await _context.Schemes
            .Where(s => s.Id == id)
            .Include(s => s.Eligibility)
            .ProjectToDto()
            .FirstOrDefaultAsync();
    }

    public async Task<Wrapper> SearchSchemesAsync(
        string? textQuery, 
        int? eligibId, 
        string? province, 
        string? organization, 
        string? sortBy, 
        bool? activeOnly, 
        int pageNumber, 
        int pageSize)
    {
        var query = _context.Schemes.AsQueryable();

        // 1. Text Search across Title and Description
        if (!string.IsNullOrWhiteSpace(textQuery))
        {
            query = query.Where(s =>
                EF.Functions.ILike(s.Title, $"%{textQuery}%") ||
                EF.Functions.ILike(s.Description, $"%{textQuery}%"));
        }

        // 2. Province Filter
        if (!string.IsNullOrWhiteSpace(province))
        {
            query = query.Where(s => EF.Functions.ILike(s.Province, $"%{province}%"));
        }

        // 3. Organization Filter
        if (!string.IsNullOrWhiteSpace(organization))
        {
            query = query.Where(s => EF.Functions.ILike(s.Organization, $"%{organization}%"));
        }

        // 4. Sorting
        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            if (sortBy.Equals("deadline", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(s => s.Deadline);
            }
            else if (sortBy.Equals("newest", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(s => s.Id);
            }
        }

        // 5. Active vs. Expired
        if (activeOnly == true)
        {
            query = query.Where(s => s.Deadline >= DateTime.UtcNow);
        }

        // 6. Eligibility Filter
        if (eligibId.HasValue)
        {
            query = query.Where(s => s.EligibilityId == eligibId.Value);
        }

        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 10;

        var totalCount = await query.CountAsync();

        var results = await query
            .ProjectToDto()
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new Wrapper
        {
            TotalCount = totalCount,
            pageSize = pageSize,
            pageNumber = pageNumber,
            totalPages = (int)Math.Ceiling((double)totalCount / pageSize),
            Schemes = results
        };
    }

    public async Task<SchemeResponseDto?> CreateSchemeAsync(CreateSchemeDto dto)
    {
        bool eligibilityExists = await _context.Eligibilities.AnyAsync(e => e.Id == dto.EligibilityID);
        if (!eligibilityExists)
        {
            return null;
        }

        var scheme = new Scheme
        {
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            EligibilityId = dto.EligibilityID,
            Organization = dto.Organization,
            Province = dto.Province,
            ApplyUrl = dto.ApplyUrl ?? string.Empty
        };

        _context.Schemes.Add(scheme);
        await _context.SaveChangesAsync();

        var eligibility = await _context.Eligibilities.FindAsync(scheme.EligibilityId);
        scheme.Eligibility = eligibility;

        return scheme.ToDto();
    }

    public async Task<bool?> UpdateSchemeAsync(int id, CreateSchemeDto dto)
    {
        var scheme = await _context.Schemes.FindAsync(id);
        if (scheme == null)
        {
            return null;
        }

        bool validEligibility = await _context.Eligibilities.AnyAsync(e => e.Id == dto.EligibilityID);
        if (!validEligibility)
        {
            return false;
        }

        scheme.Title = dto.Title;
        scheme.Description = dto.Description;
        scheme.Organization = dto.Organization;
        scheme.Province = dto.Province;
        scheme.EligibilityId = dto.EligibilityID;
        scheme.Deadline = dto.Deadline;
        scheme.ApplyUrl = dto.ApplyUrl ?? string.Empty;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteSchemeAsync(int id)
    {
        var scheme = await _context.Schemes.FindAsync(id);
        if (scheme == null)
        {
            return false;
        }

        _context.Schemes.Remove(scheme);
        await _context.SaveChangesAsync();
        return true;
    }
}
