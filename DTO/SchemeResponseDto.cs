using System.ComponentModel.DataAnnotations;

namespace PersonalProject.Dtos;

// Dtos/SchemeResponse
public class SchemeResponseDto
{
    public int id {get; set;}
    public string Title {get; set;} = string.Empty;
    public string Description {get; set;} = string.Empty;
    public DateTime Deadline{get; set;}
    public string Organization {get; set;} = string.Empty;
    public string Province {get; set;} = string.Empty;
    public string? ApplyUrl {get; set;} = string.Empty;
    public string EligibilityName{get; set;} = string.Empty;

}

// Dtos/CreateSchemeDto
public class CreateSchemeDto
{
    public string Title {get; set;} = string.Empty;
    
    public string Description {get; set;} = string.Empty;
    
    public DateTime Deadline {get; set;}

    public string Organization {get; set;} = string.Empty;

    public string Province {get; set;} = string.Empty;

    public string? ApplyUrl {get; set;} = string.Empty;
    
    
    public int EligibilityID {get; set;}
}