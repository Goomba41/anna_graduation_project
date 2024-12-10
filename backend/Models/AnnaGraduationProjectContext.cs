using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class AnnaGraduationProjectContext : DbContext
{
    public IConfiguration _configuration;

    public AnnaGraduationProjectContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public AnnaGraduationProjectContext(DbContextOptions<AnnaGraduationProjectContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<ErrorLog> ErrorLogs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Institution> Institutions { get; set; }

    public virtual DbSet<Material> Materials { get; set; }

    public virtual DbSet<UsersActivity> UsersActivities { get; set; }

    public virtual DbSet<DepartureType> DepartureTypes { get; set; }

    public virtual DbSet<DocumentType> DocumentTypes { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(_configuration.GetSection("DatabaseConnectionString").Value);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ErrorLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_ErrorLogs");

            entity.ToTable("error_logs");

            entity.HasIndex(e => e.UserId, "IX_FK_EmployeeErrorLog");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Date)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("date");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Details).HasColumnName("details");
            entity.Property(e => e.Event).HasColumnName("event");
            entity.Property(e => e.Hostname).HasColumnName("hostname");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.ErrorLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_EmployeeErrorLog");
        });

        modelBuilder.Entity<Institution>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("institutions_pk");

            entity.ToTable("institutions");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deleted)
                .HasComment("Удален (не выводить)")
                .HasColumnName("deleted");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
            entity.Property(e => e.Address)
                .HasColumnType("character varying")
                .HasColumnName("address");
            entity.Property(e => e.Contact)
                .HasColumnType("character varying")
                .HasColumnName("contact");
            entity.Property(e => e.Subject)
                .HasColumnName("subject");
            entity.Property(e => e.SubjectString)
                .HasColumnType("character varying")
                .HasColumnName("subject_string");
            entity.Property(e => e.District)
                .HasColumnName("district");
            entity.Property(e => e.DistrictString)
                .HasColumnType("character varying")
                .HasColumnName("district_string");
            entity.Property(e => e.Locality)
                .HasColumnName("locality");
            entity.Property(e => e.LocalityString)
                .HasColumnType("character varying")
                .HasColumnName("locality_string");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pk");

            entity.ToTable("users");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deleted)
                .HasComment("Удален (не выводить)")
                .HasColumnName("deleted");
            entity.Property(e => e.Email)
                .HasColumnType("character varying")
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasColumnType("character varying")
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasColumnType("character varying")
                .HasColumnName("last_name");
            entity.Property(e => e.Login)
                .HasColumnType("character varying")
                .HasColumnName("login");
            entity.Property(e => e.Password)
                .HasColumnType("character varying")
                .HasColumnName("password");
            entity.Property(e => e.Patronymic)
                .HasColumnType("character varying")
                .HasColumnName("patronymic");
            entity.Property(e => e.Phone)
                .HasColumnType("character varying")
                .HasColumnName("phone");
            entity.Property(e => e.Sysadmin).HasColumnName("sysadmin");
        });

        modelBuilder.Entity<UsersActivity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("pk_adminusersactivity");

            entity.ToTable("users_activity");

            entity.HasIndex(e => e.Userid, "IX_users_activity_userid");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Action)
                .HasColumnType("character varying")
                .HasColumnName("action");
            entity.Property(e => e.Actiondate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("actiondate");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.User).WithMany(p => p.UsersActivities)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("users_activity_fk_1");
        });

        modelBuilder.Entity<DepartureType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("departure_types_pk");

            entity.ToTable("departure_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deleted)
                .HasComment("Удален (не выводить)")
                .HasColumnName("deleted");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
        });

        modelBuilder.Entity<DocumentType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("document_types_pk");

            entity.ToTable("document_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deleted)
                .HasComment("Удален (не выводить)")
                .HasColumnName("deleted");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("projects_pk");

            entity.ToTable("project");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deleted)
                .HasComment("Удален (не выводить)")
                .HasColumnName("deleted");
            entity.Property(e => e.Name)
                .HasColumnType("character varying")
                .HasColumnName("name");
        });

        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("materials_pk");

            entity.ToTable("materials");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Deleted)
                .HasComment("Удален (не выводить)")
                .HasColumnName("deleted");
            entity.Property(e => e.ActionDate)
                .HasColumnType("timestamp with time zone")
                .HasColumnName("action_date");
            entity.Property(e => e.Number)
                .HasColumnType("character varying")
                .HasColumnName("number");
            entity.Property(e => e.AdditionalInfo)
                .HasColumnType("character varying")
                .HasColumnName("info");
            entity.Property(e => e.Control)
                .HasColumnType("timestamp with time zone")
                .HasColumnName("control_date");
            entity.Property(e => e.Fact)
                .HasColumnType("timestamp with time zone")
                .HasColumnName("fact_date");
            entity.Property(e => e.MaterialType).HasColumnName("material_type");

            entity.Property(e => e.DepartureTypeId).HasColumnName("departure");
            entity.Property(e => e.DocumentTypeId).HasColumnName("document_type");
            entity.Property(e => e.ProjectId).HasColumnName("project");
            entity.Property(e => e.InstitutionId).HasColumnName("institution");
            entity.Property(e => e.CreatorId).HasColumnName("user");

            entity.HasOne(d => d.DepartureType).WithMany(p => p.Materials)
                .HasForeignKey(d => d.DepartureTypeId)
                .HasConstraintName("departure_fk");
            entity.HasOne(d => d.DocumentType).WithMany(p => p.Materials)
                .HasForeignKey(d => d.DocumentTypeId)
                .HasConstraintName("document_type_fk");
            entity.HasOne(d => d.Project).WithMany(p => p.Materials)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("project_fk");
            entity.HasOne(d => d.Institution).WithMany(p => p.Materials)
                .HasForeignKey(d => d.InstitutionId)
                .HasConstraintName("institutions_fk");
            entity.HasOne(d => d.Creator).WithMany(p => p.Materials)
                .HasForeignKey(d => d.CreatorId)
                .HasConstraintName("users_fk");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
