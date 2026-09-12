using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalProject.Dtos;
using PersonalProject.Services;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SchemesController : ControllerBase
{
    private readonly ISchemeService _schemeService;

    public SchemesController(ISchemeService schemeService)
    {
        _schemeService = schemeService;
    }

    // GET: /api/schemes?pageNumber=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<Wrapper>> GetSchemes(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _schemeService.GetSchemesAsync(pageNumber, pageSize);
        return Ok(result);
    }

    // GET: /api/schemes/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SchemeResponseDto>> GetSchemeById(int id)
    {
        var scheme = await _schemeService.GetSchemeByIdAsync(id);
        if (scheme == null)
        {
            return NotFound();
        }
        return Ok(scheme);
    }

    // POST: /api/schemes
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> CreateScheme([FromBody] CreateSchemeDto dto)
    {
        var scheme = await _schemeService.CreateSchemeAsync(dto);
        if (scheme == null)
        {
            return NotFound(new { message = "Eligibility Id was invalid" });
        }

        return CreatedAtAction(nameof(GetSchemeById), new { id = scheme.id }, scheme);
    }

    // GET: /api/schemes/search
    [HttpGet("search")]
    public async Task<IActionResult> SearchItems(
        [FromQuery] string? textQuery, 
        [FromQuery] int? eligibID,
        [FromQuery] string? province, 
        [FromQuery] string? organization, 
        [FromQuery] string? sortBy, 
        [FromQuery] bool? activeOnly,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var result = await _schemeService.SearchSchemesAsync(
            textQuery, eligibID, province, organization, sortBy, activeOnly, pageNumber, pageSize);
            
        return Ok(result);
    }

    // PUT: /api/schemes/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> EditScheme(int id, [FromBody] CreateSchemeDto dto)
    {
        var result = await _schemeService.UpdateSchemeAsync(id, dto);
        if (result == null)
        {
            return NotFound(new { message = $"Scheme with Id {id} does not exist" });
        }
        if (result == false)
        {
            return NotFound(new { message = $"Invalid Category Id {dto.EligibilityID}" });
        }

        return NoContent();
    }

    // DELETE: /api/schemes/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteScheme(int id)
    {
        var deleted = await _schemeService.DeleteSchemeAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = $"Scheme with Id {id} does not exist" });
        }

        return NoContent();
    }

    [HttpGet("test-error")]
    public IActionResult TestError()
    {
        throw new InvalidOperationException("This is a deliberate test exception!");
    }
}
