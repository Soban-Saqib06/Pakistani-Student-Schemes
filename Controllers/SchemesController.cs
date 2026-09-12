using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Models;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")] //Url: /api/schemes
public class SchemesController : ControllerBase
{
    private readonly AppDbContext _context;
    public SchemesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: /api/schemes (all schemes)
    [HttpGet]
    public async Task<ActionResult<Wrapper>> GetSchemes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {

        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 10;
        var totalCount = await _context.Schemes.CountAsync() ;  
        var Page = new Wrapper
        {
          TotalCount = totalCount,
          pageSize = pageSize,
          pageNumber = pageNumber,
          totalPages = (int)Math.Ceiling((double)totalCount/pageSize),
          Schemes = await _context.Schemes
                        .Include(s => s.Eligibility)
                        .Select(s => new SchemeResponseDto
                        {
                            id = s.Id,
                            Title = s.Title,
                            Description = s.Description,
                            Deadline = s.Deadline,
                            EligibilityName = s.Eligibility != null ? s.Eligibility.Name : "General",
                            Organization = s.Organization,
                            Province = s.Province,
                            ApplyUrl = s.ApplyUrl ?? ""
                        }).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                        .ToListAsync() 
        };

        return Ok(Page);
    }

    // Get /api/schemes/id (Get specific id)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SchemeResponseDto>> GetSchemeById(int id)
    {
        var scheme = await _context.Schemes
                    .Where(s => s.Id == id)
                    .Include(s => s.Eligibility)
                    .Select(s => new SchemeResponseDto
                    {
                        id = s.Id,
                        Title = s.Title,
                        Description = s.Description,
                        Deadline = s.Deadline,
                        EligibilityName = s.Eligibility != null ? s.Eligibility.Name : "General",
                        Organization = s.Organization,
                        Province = s.Province,
                        ApplyUrl = s.ApplyUrl ?? ""
                    })
                    .FirstOrDefaultAsync();

        if (scheme == null)
        {
            return NotFound();
        }
        return Ok(scheme);
    }

    // Post /api/schemes (Create new Scheme)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> CreateScheme([FromBody] CreateSchemeDto dto)
    {
        var scheme = new Scheme
        {
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            EligibilityId = dto.EligibilityID,
            Organization = dto.Organization,
            Province = dto.Province,
            ApplyUrl = dto.ApplyUrl ?? ""
        };

        bool EligibilityExists = await _context.Eligibilities.AnyAsync(e => e.Id == scheme.EligibilityId);
        if (!EligibilityExists)
        {
            return NotFound(new { Message = "Eligibility Id was invalid" });
        }

        _context.Schemes.Add(scheme);
        await _context.SaveChangesAsync();

        var ResponseScheme = new SchemeResponseDto
        {
            id = scheme.Id,
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            EligibilityName = (await _context.Eligibilities.FindAsync(scheme.EligibilityId))?.Name ?? "General",
            Organization = dto.Organization,
            Province = dto.Province,
            ApplyUrl = dto.ApplyUrl ?? ""
        };

        return CreatedAtAction(nameof(GetSchemeById), new { id = scheme.Id }, ResponseScheme);
    }

    //GET /search
    [HttpGet("search")]
    public async Task<IActionResult> SearchItems([FromQuery] string? textQuery, [FromQuery] int? eligibID,
    [FromQuery] string? province, [FromQuery] string? organization, [FromQuery] string? sortBy, [FromQuery] bool? activeOnly,
    [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var query = _context.Schemes.AsQueryable();

        if (!string.IsNullOrWhiteSpace(textQuery))
        {
            query = query.Where(s =>
            EF.Functions.ILike(s.Title, $"%{textQuery}%") ||
            EF.Functions.ILike(s.Description, $"%{textQuery}%"));
        }
        if (!string.IsNullOrWhiteSpace(province))
        {
            query = query.Where(s => EF.Functions.ILike(s.Province, $"%{province}%"));
        }
        if (!string.IsNullOrWhiteSpace(organization))
        {
            query = query.Where(s => EF.Functions.ILike(s.Organization, $"%{organization}%"));
        }
        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            if (sortBy.ToLower() == "deadline")
            {
                query = query.OrderBy(s => s.Deadline);
            }
            else if (sortBy.ToLower() == "newest")
            {
                query = query.OrderBy(s => s.Id);
            }
        }
        if (activeOnly != null && activeOnly == true)
        {
            query = query.Where(s => s.Deadline >= DateTime.UtcNow);
        }
        if (eligibID.HasValue)
        {
            query = query.Where(s =>
            s.EligibilityId == eligibID.Value);
        }

        if (pageNumber < 1) pageNumber = 1;
        if (pageSize < 1 || pageSize > 50) pageSize = 10;

        var results = await query.Select(s => new SchemeResponseDto
        {
            id = s.Id,
            Title = s.Title,
            Deadline = s.Deadline,
            Description = s.Description,
            EligibilityName = s.Eligibility != null ? s.Eligibility.Name : "General",
            Organization = s.Organization,
            Province = s.Province,
            ApplyUrl = s.ApplyUrl ?? ""
        }).Skip((pageNumber - 1) * pageSize).Take(pageSize)
        .ToListAsync();

        var totalCount = await query.CountAsync();  
        var Page = new Wrapper
        {
          TotalCount = totalCount,
          pageSize = pageSize,
          pageNumber = pageNumber,
          totalPages = (int)Math.Ceiling((double)totalCount/pageSize),
          Schemes = results  
        };

        return Ok(Page);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> EditScheme(int id, [FromBody] CreateSchemeDto dto)
    {
        var scheme = await _context.Schemes.FindAsync(id);

        if (scheme == null)
        {
            return NotFound(new { Message = $"Scheme with Id {id} does not exist" });
        }

        bool ValidEligibilityId = await _context.Eligibilities.AnyAsync(e => e.Id == dto.EligibilityID);
        if (!ValidEligibilityId)
        {
            return NotFound(new { Message = $"Invalid Category Id {dto.EligibilityID}" });
        }

        scheme.Title = dto.Title;
        scheme.Description = dto.Description;
        scheme.Organization = dto.Organization;
        scheme.Province = dto.Province;
        scheme.EligibilityId = dto.EligibilityID;
        scheme.Deadline = dto.Deadline;
        scheme.ApplyUrl = dto.ApplyUrl;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteScheme(int id)
    {
        var scheme = await _context.Schemes.FindAsync(id);

        if (scheme == null)
        {
            return NotFound(new { Message = $"Scheme with Id {id} does not exist" });
        }

        _context.Schemes.Remove(scheme);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("test-error")]
    public IActionResult TestError()
    {
        throw new InvalidOperationException("This is a deliberate test exception!");
    }

}