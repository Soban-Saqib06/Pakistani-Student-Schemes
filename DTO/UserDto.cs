using System.ComponentModel.DataAnnotations;

namespace PersonalProject.Dtos;

public class RegisterUserDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}

public class UserResponseDto
{
    public int Id {get; set;}
    public string Name {get; set;} = string.Empty;
    public string Email {get; set;} = string.Empty;
    public DateTime CreatedAt {get; set;}
}


public class LoginUserDto 
{
    public string Email {get; set;} = string.Empty;

    public string Password {get; set;} = string.Empty;        
}