using PersonalProject.Dtos;

namespace PersonalProject.Services;

public interface IAuthService
{
    // 1. Registers a new student (returns null if email is already taken)
    Task<UserResponseDto?> RegisterAsync(RegisterUserDto dto);

    // 2. Authenticates a user and returns their JWT token (returns null if email/password is invalid)
    Task<AuthResponseDto?> LoginAsync(LoginUserDto dto);

    // 3. Gets a user profile by ID (returns null if user does not exist)
    Task<UserResponseDto?> GetUserByIdAsync(int id);
}
