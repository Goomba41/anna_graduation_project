using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    sysadmin = table.Column<bool>(type: "boolean", nullable: false),
                    login = table.Column<string>(type: "character varying", nullable: false),
                    last_name = table.Column<string>(type: "character varying", nullable: true),
                    first_name = table.Column<string>(type: "character varying", nullable: true),
                    patronymic = table.Column<string>(type: "character varying", nullable: true),
                    phone = table.Column<string>(type: "character varying", nullable: true),
                    email = table.Column<string>(type: "character varying", nullable: true),
                    password = table.Column<string>(type: "character varying", nullable: true),
                    deleted = table.Column<bool>(type: "boolean", nullable: false, comment: "Удален (не выводить)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("users_pk", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "error_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    @event = table.Column<string>(name: "event", type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    hostname = table.Column<string>(type: "text", nullable: false),
                    details = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ErrorLogs", x => x.id);
                    table.ForeignKey(
                        name: "FK_EmployeeErrorLog",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "users_activity",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    action = table.Column<string>(type: "character varying", nullable: false),
                    actiondate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false, defaultValueSql: "''::text"),
                    EntityId = table.Column<int>(type: "integer", nullable: true),
                    EntityRowId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_adminusersactivity", x => x.id);
                    table.ForeignKey(
                        name: "users_activity_fk_1",
                        column: x => x.userid,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FK_EmployeeErrorLog",
                table: "error_logs",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_activity_userid",
                table: "users_activity",
                column: "userid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "error_logs");

            migrationBuilder.DropTable(
                name: "users_activity");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
