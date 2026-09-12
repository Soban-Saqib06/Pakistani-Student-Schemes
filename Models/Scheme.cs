using System.Text.Json.Serialization;

namespace PersonalProject.Models;

public class Scheme
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public string Organization {get; set;} = string.Empty;
    public string? ApplyUrl {get; set;} = string.Empty;
    public string Province {get; set;} = string.Empty;

    public int EligibilityId { get; set; }


    [JsonIgnore]
    public Eligibility? Eligibility { get; set; }

    [JsonIgnore]
    public ICollection<SavedScheme> SavedSchemes {get; set;} = new List<SavedScheme>();

}