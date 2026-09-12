using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Models;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")]

public class EligibilityController : ControllerBase
{
    private readonly AppDbContext _context;

    public EligibilityController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EligibilityResponseDto>>> GetAllCategories()
    {
        var eligibility = await _context.Eligibilities
                                .Select(e=> new EligibilityResponseDto
                                {
                                    Id = e.Id,
                                    Name = e.Name,
                                    Schemes = e.Schemes.Select(s=> new SchemeSummaryDto
                                    {
                                        Id = s.Id,
                                        Title = s.Title,
                                        Description = s.Description,
                                        Deadline = s.Deadline
                                    }).ToList()
                                })
                                .ToListAsync();
        
        return Ok(eligibility);
    }



    [HttpGet("{id:int}")]
    // GET /api/eligibility/id
    public async Task<ActionResult<EligibilityResponseDto>> GetCategoryById(int id)
    {
        var eligibility = await _context.Eligibilities
                            .Where(e => e.Id == id)
                            .Select(e => new EligibilityResponseDto
                            {
                                Id = e.Id,
                                Name = e.Name,
                                Schemes = e.Schemes.Select(s => new SchemeSummaryDto
                                {
                                    Id = s.Id,
                                    Title = s.Title,
                                    Description = s.Description,
                                    Deadline = s.Deadline
                                }).ToList()
                            })
                            .FirstOrDefaultAsync();
        if(eligibility == null)
        {
            return NotFound();
        }

        return Ok(eligibility);
    }  

[Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory(EligibilityCreationDto dto)
    {
        var eligibilityExists = await _context.Eligibilities.AnyAsync(e => e.Name.ToLower() == dto.Name.Trim().ToLower());
        if (eligibilityExists)
        {
            return Conflict(new {message = "A category with this name already exists. "});
        }

        var Eligibility = new Eligibility
        {
            Name = dto.Name
        };
        await _context.Eligibilities.AddAsync(Eligibility);
        await _context.SaveChangesAsync();

        var ResponseDto = new EligibilityResponseDto
        {
            Id = Eligibility.Id,
            Name = Eligibility.Name
        };

        return CreatedAtAction(nameof(GetCategoryById), new { id = Eligibility.Id}, ResponseDto);
    }
}