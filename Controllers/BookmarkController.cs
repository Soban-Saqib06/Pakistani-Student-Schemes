using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Models;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookmarksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookmarksController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid or missing user Id in token.");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SchemeResponseDto>>> GetSavedSchemes()
    {
        var currentUserId = GetCurrentUserId();

        var bookmarkedSchemes = await _context.SavedSchemes
                                    .Where(ss => ss.UserId == currentUserId)
                                    .Select(ss => new SchemeResponseDto
                                    {
                                        id = ss.Scheme!.Id,
                                        Title = ss.Scheme.Title,
                                        Description = ss.Scheme.Description,
                                        Deadline = ss.Scheme.Deadline,
                                        EligibilityName = ss.Scheme.Eligibility != null ? ss.Scheme.Eligibility.Name : "General",
                                        Organization = ss.Scheme.Organization,
                                        Province = ss.Scheme.Province,
                                        ApplyUrl = ss.Scheme.ApplyUrl ?? ""
                                    })
                                    .ToListAsync(); 
        return Ok(bookmarkedSchemes);
    }
   
    [HttpPost("{schemeId:int}")]
    public async Task<IActionResult> BookmarkScheme(int schemeId)
    {
        var currentuserId = GetCurrentUserId();

        var schemeExists = await _context.Schemes.AnyAsync(s => s.Id == schemeId);
        if (!schemeExists)
        {
            return NotFound(new {message = $"Scheme with ID {schemeId} does not exist"});
        }

        var alreadySaved = await _context.SavedSchemes
                            .AnyAsync(ss => ss.UserId == currentuserId && ss.SchemeId == schemeId);

        if (alreadySaved)
        {
            return Conflict(new {message = "Scheme is aready in your bookmarks"});
        }

        var SavedScheme = new SavedScheme
        {
            UserId = currentuserId,
            SchemeId = schemeId,
            SavedAt = DateTime.UtcNow
        };

        _context.SavedSchemes.Add(SavedScheme);
        await _context.SaveChangesAsync();

        return Ok(new {message = "Scheme bookmarked successfully"});
    }

    [HttpDelete("{schemeId:int}")]
    public async Task<IActionResult> DeleteBookmarkedScheme(int schemeId)
    {
        var Deleted = await _context.SavedSchemes
                        .Where(SS => SS.UserId == GetCurrentUserId() && SS.SchemeId == schemeId)
                        .ExecuteDeleteAsync();
        if (Deleted == 0)
        {
            return NotFound(new {Message = "Scheme Not Found in bookmarks"});
        }

        return Ok(new {Message = "Deleted Successfully"});
    }
}