using FluentValidation;
using PersonalProject.Dtos;

namespace PersonalProject.Validators;

public class EligibilityCreationDtoValidator : AbstractValidator<EligibilityCreationDto>
{
    public EligibilityCreationDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .Length(2, 50).WithMessage("Category name must be between 2 and 50 characters.");
    }
}