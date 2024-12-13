﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Models;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(AnnaGraduationProjectContext))]
    [Migration("20241213092252_AddFilesTable")]
    partial class AddFilesTable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Models.DepartureType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean")
                        .HasColumnName("deleted")
                        .HasComment("Удален (не выводить)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("departure_types_pk");

                    b.ToTable("departure_type", (string)null);
                });

            modelBuilder.Entity("backend.Models.DocumentType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean")
                        .HasColumnName("deleted")
                        .HasComment("Удален (не выводить)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("document_types_pk");

                    b.ToTable("document_type", (string)null);
                });

            modelBuilder.Entity("backend.Models.ErrorLog", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("date");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Details")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("details");

                    b.Property<string>("Event")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("event");

                    b.Property<string>("Hostname")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("hostname");

                    b.Property<int?>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("user_id");

                    b.HasKey("Id")
                        .HasName("PK_ErrorLogs");

                    b.HasIndex(new[] { "UserId" }, "IX_FK_EmployeeErrorLog");

                    b.ToTable("error_logs", (string)null);
                });

            modelBuilder.Entity("backend.Models.File", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("Atime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<byte[]>("Binary")
                        .IsRequired()
                        .HasColumnType("bytea");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean");

                    b.Property<int?>("MaterialId")
                        .HasColumnType("integer");

                    b.Property<string>("Mime")
                        .HasColumnType("text");

                    b.Property<DateTime>("Mtime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("MaterialId");

                    b.ToTable("Files");
                });

            modelBuilder.Entity("backend.Models.Institution", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("address");

                    b.Property<string>("Contact")
                        .HasColumnType("character varying")
                        .HasColumnName("contact");

                    b.Property<DateTime>("CreationDateTime")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("creation_datetime");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean")
                        .HasColumnName("deleted")
                        .HasComment("Удален (не выводить)");

                    b.Property<int>("District")
                        .HasColumnType("integer")
                        .HasColumnName("district");

                    b.Property<string>("DistrictString")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("district_string");

                    b.Property<int>("Locality")
                        .HasColumnType("integer")
                        .HasColumnName("locality");

                    b.Property<string>("LocalityString")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("locality_string");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("name");

                    b.Property<int>("Subject")
                        .HasColumnType("integer")
                        .HasColumnName("subject");

                    b.Property<string>("SubjectString")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("subject_string");

                    b.HasKey("Id")
                        .HasName("institutions_pk");

                    b.ToTable("institutions", (string)null);
                });

            modelBuilder.Entity("backend.Models.Material", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("ActionDate")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("action_date");

                    b.Property<string>("AdditionalInfo")
                        .HasColumnType("character varying")
                        .HasColumnName("info");

                    b.Property<DateTime?>("Control")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("control_date");

                    b.Property<int?>("CreatorId")
                        .HasColumnType("integer")
                        .HasColumnName("user");

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean")
                        .HasColumnName("deleted")
                        .HasComment("Удален (не выводить)");

                    b.Property<int?>("DepartureTypeId")
                        .HasColumnType("integer")
                        .HasColumnName("departure");

                    b.Property<int?>("DocumentTypeId")
                        .HasColumnType("integer")
                        .HasColumnName("document_type");

                    b.Property<DateTime?>("Fact")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("fact_date");

                    b.Property<int?>("InstitutionId")
                        .HasColumnType("integer")
                        .HasColumnName("institution");

                    b.Property<int>("MaterialType")
                        .HasColumnType("integer")
                        .HasColumnName("material_type");

                    b.Property<string>("Number")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("number");

                    b.Property<int?>("ProjectId")
                        .HasColumnType("integer")
                        .HasColumnName("project");

                    b.HasKey("Id")
                        .HasName("materials_pk");

                    b.HasIndex("CreatorId");

                    b.HasIndex("DepartureTypeId");

                    b.HasIndex("DocumentTypeId");

                    b.HasIndex("InstitutionId");

                    b.HasIndex("ProjectId");

                    b.ToTable("materials", (string)null);
                });

            modelBuilder.Entity("backend.Models.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean")
                        .HasColumnName("deleted")
                        .HasComment("Удален (не выводить)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("name");

                    b.HasKey("Id")
                        .HasName("projects_pk");

                    b.ToTable("project", (string)null);
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("Deleted")
                        .HasColumnType("boolean")
                        .HasColumnName("deleted")
                        .HasComment("Удален (не выводить)");

                    b.Property<string>("Email")
                        .HasColumnType("character varying")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .HasColumnType("character varying")
                        .HasColumnName("first_name");

                    b.Property<string>("LastName")
                        .HasColumnType("character varying")
                        .HasColumnName("last_name");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("login");

                    b.Property<string>("Password")
                        .HasColumnType("character varying")
                        .HasColumnName("password");

                    b.Property<string>("Patronymic")
                        .HasColumnType("character varying")
                        .HasColumnName("patronymic");

                    b.Property<string>("Phone")
                        .HasColumnType("character varying")
                        .HasColumnName("phone");

                    b.Property<bool>("Sysadmin")
                        .HasColumnType("boolean")
                        .HasColumnName("sysadmin");

                    b.HasKey("Id")
                        .HasName("users_pk");

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("backend.Models.UsersActivity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Action")
                        .IsRequired()
                        .HasColumnType("character varying")
                        .HasColumnName("action");

                    b.Property<DateTime?>("Actiondate")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("actiondate");

                    b.Property<int?>("Userid")
                        .HasColumnType("integer")
                        .HasColumnName("userid");

                    b.HasKey("Id")
                        .HasName("pk_adminusersactivity");

                    b.HasIndex(new[] { "Userid" }, "IX_users_activity_userid");

                    b.ToTable("users_activity", (string)null);
                });

            modelBuilder.Entity("backend.Models.ErrorLog", b =>
                {
                    b.HasOne("backend.Models.User", "User")
                        .WithMany("ErrorLogs")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .HasConstraintName("FK_EmployeeErrorLog");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.File", b =>
                {
                    b.HasOne("backend.Models.Material", "Material")
                        .WithMany("Files")
                        .HasForeignKey("MaterialId");

                    b.Navigation("Material");
                });

            modelBuilder.Entity("backend.Models.Material", b =>
                {
                    b.HasOne("backend.Models.User", "Creator")
                        .WithMany("Materials")
                        .HasForeignKey("CreatorId")
                        .HasConstraintName("users_fk");

                    b.HasOne("backend.Models.DepartureType", "DepartureType")
                        .WithMany("Materials")
                        .HasForeignKey("DepartureTypeId")
                        .HasConstraintName("departure_fk");

                    b.HasOne("backend.Models.DocumentType", "DocumentType")
                        .WithMany("Materials")
                        .HasForeignKey("DocumentTypeId")
                        .HasConstraintName("document_type_fk");

                    b.HasOne("backend.Models.Institution", "Institution")
                        .WithMany("Materials")
                        .HasForeignKey("InstitutionId")
                        .HasConstraintName("institutions_fk");

                    b.HasOne("backend.Models.Project", "Project")
                        .WithMany("Materials")
                        .HasForeignKey("ProjectId")
                        .HasConstraintName("project_fk");

                    b.Navigation("Creator");

                    b.Navigation("DepartureType");

                    b.Navigation("DocumentType");

                    b.Navigation("Institution");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("backend.Models.UsersActivity", b =>
                {
                    b.HasOne("backend.Models.User", "User")
                        .WithMany("UsersActivities")
                        .HasForeignKey("Userid")
                        .HasConstraintName("users_activity_fk_1");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.DepartureType", b =>
                {
                    b.Navigation("Materials");
                });

            modelBuilder.Entity("backend.Models.DocumentType", b =>
                {
                    b.Navigation("Materials");
                });

            modelBuilder.Entity("backend.Models.Institution", b =>
                {
                    b.Navigation("Materials");
                });

            modelBuilder.Entity("backend.Models.Material", b =>
                {
                    b.Navigation("Files");
                });

            modelBuilder.Entity("backend.Models.Project", b =>
                {
                    b.Navigation("Materials");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Navigation("ErrorLogs");

                    b.Navigation("Materials");

                    b.Navigation("UsersActivities");
                });
#pragma warning restore 612, 618
        }
    }
}
