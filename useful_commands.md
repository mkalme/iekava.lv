# Debugging
sudo dotnet build /home/mikelis.kalme/webserver/domain/iekava.lv/portal/api && sudo dotnet run --project /home/mikelis.kalme/webserver/domain/iekava.lv/portal/api
sudo pkill dotnet

# SSL certificate generator
sudo certbot certonly --manual --preferred-challenges dns -d 'hard.lv,*.hard.lv,oga.id.lv,*.oga.id.lv,iekava.lv,*.iekava.lv,krupis.lv,*.krupis.lv,sponge.lv,*.sponge.lv,wax.lv,*.wax.lv' --force-renewal

# Migrating
sudo env "PATH=$PATH" dotnet ef migrations add <MigratrionName>
sudo env "PATH=$PATH" dotnet ef database update

# Database
psql -h localhost -p 5432 -d iekava -U admin;

# Database: list users with their scopes
SELECT
    "u"."Username" AS "username",
    "s"."Id" AS "scope_name"
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
    "s"."Id";

# Database: list roles with their scopes
SELECT
    "r"."Id" AS "role_name",
    "s"."Id" AS "scope_name"
FROM
    "Roles" AS "r"
JOIN
    "RoleScopes" AS "rs" ON "r"."Id" = "rs"."RoleId"
JOIN
    "Scopes" AS "s" ON "rs"."ScopesId" = "s"."Id"
ORDER BY
    "r"."Id",
    "s"."Id";

# Database: list users with their roles
SELECT
    "u"."Username" AS "username",
    "r"."Id" AS "role_name"
FROM
    "Users" AS "u"
JOIN
    "UserRoles" AS "ur" ON "u"."Id" = "ur"."UserId"
JOIN
    "Roles" AS "r" ON "ur"."RolesId" = "r"."Id"
ORDER BY
    "u"."Username",
    "r"."Id";

# Database: list users with a given scope
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
    "s"."Id" = '<ScopeName>'
ORDER BY
    "u"."Username";