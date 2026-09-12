using System.Text.Json.Serialization;

namespace PersonalProject.Models;

public class SavedScheme
{
    public int UserId{get; set;}
    [JsonIgnore]
    public User? User{get; set;}

    public int SchemeId {get; set;}
    [JsonIgnore]
    public Scheme? Scheme{get;set;}

    public DateTime SavedAt {get;set;} = DateTime.UtcNow;
}