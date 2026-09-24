using System.ComponentModel.DataAnnotations;
using PersonalProject.Models;

namespace PersonalProject.Dtos;

public class EligibilityResponseDto
{
    public int Id {get; set;}
    public string Name {get; set;} = string.Empty;
    public List<SchemeSummaryDto> Schemes{get; set;} = new();
}

public class SchemeSummaryDto
{
    public int Id {get; set;}
    public string Title {get; set;} = string.Empty;
    public string Description {get; set;} = string.Empty;
    public DateTime? Deadline {get; set;}
}

public class EligibilityCreationDto
{
    public string Name {get; set;} = string.Empty;
}