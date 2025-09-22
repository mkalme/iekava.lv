# Debugging
sudo dotnet build && sudo dotnet run
sudo pkill dotnet

# Migrating
sudo env "PATH=$PATH" dotnet ef migrations add <MigratrionName>
sudo env "PATH=$PATH" dotnet ef database update

# Database
psql -h localhost -p 5432 -d iekava -U admin

# List users with their scopes
SELECT
    "u"."Username" AS "username",
    "s"."Name" AS "scope_name"
FROM
    "Users" AS "u"
JOIN
    "UserRoles" AS "ur" ON "u"."Id" = "ur"."UserId"
JOIN
    "Roles" AS "r" ON "ur"."RolesId" = "r"."Id"
JOIN
    "RoleScopes" AS "rs" ON "r"."Id" = "rs"."RoleId"
JOIN
    "Scopes" AS "s" ON "rs"."ScopesId" = "s"."Id"
ORDER BY
    "u"."Username",
    "s"."Name";

# List roles with their scopes
SELECT
    "r"."Name" AS "role_name",
    "s"."Name" AS "scope_name"
FROM
    "Roles" AS "r"
JOIN
    "RoleScopes" AS "rs" ON "r"."Id" = "rs"."RoleId"
JOIN
    "Scopes" AS "s" ON "rs"."ScopesId" = "s"."Id"
ORDER BY
    "r"."Name",
    "s"."Name";

# List users with their roles
SELECT
    "u"."Username" AS "username",
    "r"."Name" AS "role_name"
FROM
    "Users" AS "u"
JOIN
    "UserRoles" AS "ur" ON "u"."Id" = "ur"."UserId"
JOIN
    "Roles" AS "r" ON "ur"."RolesId" = "r"."Id"
ORDER BY
    "u"."Username",
    "r"."Name";

# List users with a given scope
SELECT
    "u"."Username" AS "username"
FROM
    "Users" AS "u"
JOIN
    "UserRoles" AS "ur" ON "u"."Id" = "ur"."UserId"
JOIN
    "Roles" AS "r" ON "ur"."RolesId" = "r"."Id"
JOIN
    "RoleScopes" AS "rs" ON "r"."Id" = "rs"."RoleId"
JOIN
    "Scopes" AS "s" ON "rs"."ScopesId" = "s"."Id"
WHERE
    "s"."Name" = 'SCOPE_NAME'
ORDER BY
    "u"."Username";