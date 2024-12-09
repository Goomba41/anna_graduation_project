using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMaterialsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "materials",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    action_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    number = table.Column<string>(type: "character varying", nullable: false),
                    material_type = table.Column<int>(type: "integer", nullable: false),
                    info = table.Column<string>(type: "character varying", nullable: true),
                    departure = table.Column<int>(type: "integer", nullable: true),
                    control_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    fact_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    document_type = table.Column<int>(type: "integer", nullable: true),
                    project = table.Column<int>(type: "integer", nullable: true),
                    institution = table.Column<int>(type: "integer", nullable: true),
                    user = table.Column<int>(type: "integer", nullable: true),
                    deleted = table.Column<bool>(type: "boolean", nullable: false, comment: "Удален (не выводить)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("materials_pk", x => x.id);
                    table.ForeignKey(
                        name: "departure_fk",
                        column: x => x.departure,
                        principalTable: "departure_type",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "document_type_fk",
                        column: x => x.document_type,
                        principalTable: "document_type",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "institutions_fk",
                        column: x => x.institution,
                        principalTable: "institutions",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "project_fk",
                        column: x => x.project,
                        principalTable: "project",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "users_fk",
                        column: x => x.user,
                        principalTable: "users",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_materials_departure",
                table: "materials",
                column: "departure");

            migrationBuilder.CreateIndex(
                name: "IX_materials_document_type",
                table: "materials",
                column: "document_type");

            migrationBuilder.CreateIndex(
                name: "IX_materials_institution",
                table: "materials",
                column: "institution");

            migrationBuilder.CreateIndex(
                name: "IX_materials_project",
                table: "materials",
                column: "project");

            migrationBuilder.CreateIndex(
                name: "IX_materials_user",
                table: "materials",
                column: "user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "materials");
        }
    }
}
