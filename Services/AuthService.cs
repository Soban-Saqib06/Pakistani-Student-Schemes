using Microsoft.EntityFrameworkCore;
using PersonalProject.Data;
using PersonalProject.Dtos;
using PersonalProject.Extensions;
using PersonalProject.Models;

namespace PersonalProject.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthService(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<UserResponseDto?> RegisterAsync(RegisterUserDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();
        var existingUser = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail);

        if (existingUser)
        {
            return null;
        }

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user.ToDto();
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginUserDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return null;
        }

        var token = _tokenService.CreateToken(user);

        return new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Message = "Login Successful",
            Token = token
        };
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(int id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .ProjectToDto()
            .FirstOrDefaultAsync();
    }
}
