using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalProject.Dtos;
using PersonalProject.Services;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EligibilityController : ControllerBase
{
    private readonly IEligibilityService _eligibilityService;

    public EligibilityController(IEligibilityService eligibilityService)
    {
        _eligibilityService = eligibilityService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EligibilityResponseDto>>> GetAllCategories()
    {
        var categories = await _eligibilityService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EligibilityResponseDto>> GetCategoryById(int id)
    {
        var category = await _eligibilityService.GetCategoryByIdAsync(id);
        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory([FromBody] EligibilityCreationDto dto)
    {
        var result = await _eligibilityService.CreateCategoryAsync(dto);
        if (result == null)
        {
            return Conflict(new { message = "A category with this name already exists." });
        }

        return CreatedAtAction(nameof(GetCategoryById), new { id = result.Id }, result);
    }
}
