namespace backend.DTOs
{
    public class UserResponseDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = "";
        public bool Sysadmin { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Patronymic { get; set; } = "";
        public string Login { get; set; } = "";
        public string Phone { get; set; } = "";
        public string FullName { get; set; } = "";
    }
}
