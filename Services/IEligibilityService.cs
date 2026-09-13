using PersonalProject.Dtos;

namespace PersonalProject.Services;

public interface IEligibilityService
{
    // 1. Get all categories with their associated schemes
    Task<IEnumerable<EligibilityResponseDto>> GetAllCategoriesAsync();

    // 2. Get a single category by ID (returns null if not found)
    Task<EligibilityResponseDto?> GetCategoryByIdAsync(int id);

    // 3. Create a category (returns null if a category with the same name already exists)
    Task<EligibilityResponseDto?> CreateCategoryAsync(EligibilityCreationDto dto);
}
