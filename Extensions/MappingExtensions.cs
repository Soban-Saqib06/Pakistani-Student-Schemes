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
            ApplyUrl = scheme.ApplyUrl ?? string.Empty,
            OfficialUrl = scheme.ApplyUrl ?? string.Empty,
            Benefits = "Full tuition fee waiver and educational assistance grant."
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
            ApplyUrl = s.ApplyUrl ?? string.Empty,
            OfficialUrl = s.ApplyUrl ?? string.Empty,
            Benefits = "Full tuition fee waiver and educational assistance grant."
        });
    }

    // 3. Database query projection: translates directly into PostgreSQL SQL SELECT statement for Eligibilities
    public static IQueryable<EligibilityResponseDto> ProjectToDto(this IQueryable<Eligibility> query)
    {
        return query.Select(e => new EligibilityResponseDto
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
        });
    }

    // 4. In-memory mapping for a newly created Eligibility entity
    public static EligibilityResponseDto ToDto(this Eligibility eligibility)
    {
        return new EligibilityResponseDto
        {
            Id = eligibility.Id,
            Name = eligibility.Name
        };
    }

    // 5. In-memory mapping for a User entity
    public static UserResponseDto ToDto(this User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }

    // 6. Database query projection for User queries
    public static IQueryable<UserResponseDto> ProjectToDto(this IQueryable<User> query)
    {
        return query.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            CreatedAt = u.CreatedAt
        });
    }
}
