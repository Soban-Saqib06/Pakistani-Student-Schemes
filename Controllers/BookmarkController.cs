using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalProject.Dtos;
using PersonalProject.Services;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookmarksController : ControllerBase
{
    private readonly IBookmarkService _bookmarkService;

    public BookmarksController(IBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
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

    // GET: /api/bookmarks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SchemeResponseDto>>> GetSavedSchemes()
    {
        var schemes = await _bookmarkService.GetSavedSchemesAsync(GetCurrentUserId());
        return Ok(schemes);
    }

    // POST: /api/bookmarks/{schemeId}
    [HttpPost("{schemeId:int}")]
    public async Task<IActionResult> BookmarkScheme(int schemeId)
    {
        var result = await _bookmarkService.BookmarkSchemeAsync(GetCurrentUserId(), schemeId);

        return result switch
        {
            BookmarkResult.SchemeNotFound => NotFound(new { message = $"Scheme with ID {schemeId} does not exist" }),
            BookmarkResult.AlreadyBookmarked => Conflict(new { message = "Scheme is already in your bookmarks" }),
            BookmarkResult.Success => Ok(new { message = "Scheme bookmarked successfully" }),
            _ => BadRequest()
        };
    }

    // DELETE: /api/bookmarks/{schemeId}
    [HttpDelete("{schemeId:int}")]
    public async Task<IActionResult> DeleteBookmarkedScheme(int schemeId)
    {
        var deleted = await _bookmarkService.RemoveBookmarkAsync(GetCurrentUserId(), schemeId);
        if (!deleted)
        {
            return NotFound(new { message = "Scheme not found in bookmarks" });
        }

        return Ok(new { message = "Deleted successfully" });
    }
}
