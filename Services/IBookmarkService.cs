using PersonalProject.Dtos;

namespace PersonalProject.Services;

public enum BookmarkResult
{
    Success,
    SchemeNotFound,
    AlreadyBookmarked
}

public interface IBookmarkService
{
    Task<IEnumerable<SchemeResponseDto>> GetSavedSchemesAsync(int userId);
    Task<BookmarkResult> BookmarkSchemeAsync(int userId, int schemeId);
    Task<bool> RemoveBookmarkAsync(int userId, int schemeId);
}
