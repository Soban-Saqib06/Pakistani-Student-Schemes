using PersonalProject.Dtos;

namespace PersonalProject.Services;

public interface ISchemeService
{
    // 1. Fetch paginated schemes
    Task<Wrapper> GetSchemesAsync(int pageNumber, int pageSize);

    // 2. Fetch a single scheme by its ID (returns null if not found)
    Task<SchemeResponseDto?> GetSchemeByIdAsync(int id);

    // 3. Search & filter with pagination
    Task<Wrapper> SearchSchemesAsync(
        string? textQuery, 
        int? eligibId, 
        string? province, 
        string? organization, 
        string? sortBy, 
        bool? activeOnly, 
        int pageNumber, 
        int pageSize);

    // 4. Create a new scheme (returns null if EligibilityId is invalid)
    Task<SchemeResponseDto?> CreateSchemeAsync(CreateSchemeDto dto);

    // 5. Update an existing scheme (returns null if not found, false if eligibility invalid, true if updated)
    Task<bool?> UpdateSchemeAsync(int id, CreateSchemeDto dto);

    // 6. Delete a scheme (returns false if not found, true if deleted)
    Task<bool> DeleteSchemeAsync(int id);
}
