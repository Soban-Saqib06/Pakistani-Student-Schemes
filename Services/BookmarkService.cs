using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Models;

namespace PersonalProject.Services;

public class BookmarkService : IBookmarkService
{
    private readonly AppDbContext _context;

    public BookmarkService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SchemeResponseDto>> GetSavedSchemesAsync(int userId)
    {
        return await _context.SavedSchemes
            .Where(ss => ss.UserId == userId)
            .Select(ss => new SchemeResponseDto
            {
                id = ss.Scheme!.Id,
                Title = ss.Scheme.Title,
                Description = ss.Scheme.Description,
                Deadline = ss.Scheme.Deadline,
                EligibilityName = ss.Scheme.Eligibility != null ? ss.Scheme.Eligibility.Name : "General",
                Organization = ss.Scheme.Organization,
                Province = ss.Scheme.Province,
                ApplyUrl = ss.Scheme.ApplyUrl ?? string.Empty,
                OfficialUrl = ss.Scheme.ApplyUrl ?? string.Empty
            })
            .ToListAsync();
    }

    public async Task<BookmarkResult> BookmarkSchemeAsync(int userId, int schemeId)
    {
        var schemeExists = await _context.Schemes.AnyAsync(s => s.Id == schemeId);
        if (!schemeExists)
        {
            return BookmarkResult.SchemeNotFound;
        }

        var alreadySaved = await _context.SavedSchemes
            .AnyAsync(ss => ss.UserId == userId && ss.SchemeId == schemeId);

        if (alreadySaved)
        {
            return BookmarkResult.AlreadyBookmarked;
        }

        var savedScheme = new SavedScheme
        {
            UserId = userId,
            SchemeId = schemeId,
            SavedAt = DateTime.UtcNow
        };

        _context.SavedSchemes.Add(savedScheme);
        await _context.SaveChangesAsync();

        return BookmarkResult.Success;
    }

    public async Task<bool> RemoveBookmarkAsync(int userId, int schemeId)
    {
        var deleted = await _context.SavedSchemes
            .Where(ss => ss.UserId == userId && ss.SchemeId == schemeId)
            .ExecuteDeleteAsync();

        return deleted > 0;
    }
}
