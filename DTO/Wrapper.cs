using PersonalProject.Models;

namespace PersonalProject.Dtos;

public class Wrapper
{
    public int TotalCount {get; set;}
    public int pageNumber {get;set;}
    public int pageSize {get;set;}
    public int totalPages {get;set;}
    public List<SchemeResponseDto> Schemes {get; set;} = new();
}