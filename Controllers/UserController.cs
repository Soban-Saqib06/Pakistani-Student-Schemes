using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Models;
using PersonalProject.Services;

namespace PersonalProject.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    
    public UsersController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    // POST /api/users/register
    public async Task<ActionResult<UserResponseDto>> Register([FromBody] RegisterUserDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();
        var existingUser = await _context.Users
                        .AnyAsync(u => u.Email.ToLower() == normalizedEmail);

        if (existingUser)
        {
            return Conflict(new {message = "A user with this email already exists."});
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Name = dto.Name,
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var response = new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };

        return CreatedAtAction(nameof(GetUserById),new {id = user.Id}, response);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<UserResponseDto>> GetUserById(int id)
    {
        var user = await _context.Users
                    .Where(u => u.Id == id)
                    .Select(u => new UserResponseDto
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        CreatedAt = u.CreatedAt
                    })
                    .FirstOrDefaultAsync();
        if(user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }


    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginUserDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();

        var user = await _context.Users
                                    .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
    
    
        if(user == null || !BCrypt.Net.BCrypt.Verify(dto.Password,user.PasswordHash))
        {
            return Unauthorized(new {message = "Invalid email or password"});
        }

        var token = _tokenService.CreateToken(user);

        var response = new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Message = "Logon Successful",
            Token = token
        };

        return Ok(response);
    }

}