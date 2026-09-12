using System.ComponentModel.DataAnnotations;

namespace PersonalProject.Models;

public class Eligibility
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = string.Empty;

    public ICollection<Scheme> Schemes { get; set; } = new List<Scheme>();
}