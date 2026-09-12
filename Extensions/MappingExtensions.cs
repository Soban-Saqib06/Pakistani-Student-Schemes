using System.Linq;
using PersonalProject.Dtos;
using PersonalProject.Models;

namespace PersonalProject.Extensions;

public static class MappingExtensions
{
    // 1. In-memory mapping: transforms a single Scheme entity into SchemeResponseDto
    public static SchemeResponseDto ToDto(this Scheme scheme)
    {
        return new SchemeResponseDto
        {
            id = scheme.Id,
            Title = scheme.Title,
            Description = scheme.Description,
            Deadline = scheme.Deadline,
            EligibilityName = scheme.Eligibility != null ? scheme.Eligibility.Name : "General",
            Organization = scheme.Organization,
            Province = scheme.Province,
            ApplyUrl = scheme.ApplyUrl ?? string.Empty
        };
    }

    // 2. Database query projection: translates directly into PostgreSQL SQL SELECT statement
    public static IQueryable<SchemeResponseDto> ProjectToDto(this IQueryable<Scheme> query)
    {
        return query.Select(s => new SchemeResponseDto
        {
            id = s.Id,
            Title = s.Title,
            Description = s.Description,
            Deadline = s.Deadline,
            EligibilityName = s.Eligibility != null ? s.Eligibility.Name : "General",
            Organization = s.Organization,
            Province = s.Province,
            ApplyUrl = s.ApplyUrl ?? string.Empty
        });
    }
}
