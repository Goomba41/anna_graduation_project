namespace backend.Models;

public class Dataset
{
    public List<int> Data { get; set; } = new List<int> { };
}

public partial class DoughnutData
{
    public List<string> Labels { get; set; } = new List<string> { };

    public List<Dataset> Datasets { get; set; } = new List<Dataset> { };
}
