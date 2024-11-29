using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UsersTableUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "users_activity_fk_1",
                table: "users_activity");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "users_activity");

            migrationBuilder.DropColumn(
                name: "EntityId",
                table: "users_activity");

            migrationBuilder.DropColumn(
                name: "EntityRowId",
                table: "users_activity");

            migrationBuilder.AlterColumn<int>(
                name: "userid",
                table: "users_activity",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<DateTime>(
                name: "actiondate",
                table: "users_activity",
                type: "timestamp without time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AddForeignKey(
                name: "users_activity_fk_1",
                table: "users_activity",
                column: "userid",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "users_activity_fk_1",
                table: "users_activity");

            migrationBuilder.AlterColumn<int>(
                name: "userid",
                table: "users_activity",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "actiondate",
                table: "users_activity",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "users_activity",
                type: "text",
                nullable: false,
                defaultValueSql: "''::text");

            migrationBuilder.AddColumn<int>(
                name: "EntityId",
                table: "users_activity",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EntityRowId",
                table: "users_activity",
                type: "text",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "users_activity_fk_1",
                table: "users_activity",
                column: "userid",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
