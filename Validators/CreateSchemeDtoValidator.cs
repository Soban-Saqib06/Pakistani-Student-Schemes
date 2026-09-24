using System.Data;
using FluentValidation;
using PersonalProject.Dtos;

namespace PersonalProject.Validators;

public class CreateSchemeDtoValidator : AbstractValidator<CreateSchemeDto>
{
    private static readonly string[] ValidProvinces =
    {
        "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
        "Federal", "Gilgit-Baltistan", "Gilgit-Balitistan", "Azad Jammu & Kashmir"
    };

    public CreateSchemeDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .Length(2, 250).WithMessage("Title must be between 2 and 250 characters.");
        
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .Length(10, 10000).WithMessage("Description must be between 10 and 10,000 characters.");
        // Deadline is optional for rolling/open-ended schemes (null when not specified)
        
        RuleFor(x => x.Organization)
            .NotEmpty().WithMessage("Organization is required.");
        
        RuleFor(x => x.Province)
            .NotEmpty().WithMessage("Province is required.")
            .Must( p => ValidProvinces.Contains(p, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"Province must be one of: {string.Join(", ", ValidProvinces)}");

        RuleFor(x => x.EligibilityID)
            .GreaterThan(0).WithMessage("A valid Eligibility ID is required.");

        When(x => !string.IsNullOrWhiteSpace(x.ApplyUrl), () =>
        {
            RuleFor(x => x.ApplyUrl)
                .Must(uri => !string.IsNullOrEmpty(uri) && (Uri.TryCreate(uri, UriKind.Absolute, out _) || uri.StartsWith("http") || uri.StartsWith("/")))
                .WithMessage("ApplyUrl must be a valid URL.");
        });
    }
}

