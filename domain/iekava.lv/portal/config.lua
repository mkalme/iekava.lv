package.path = package.path .. ";/home/mikelis.kalme/webserver/script/?.lua"
local api_proxy = require("api_proxy")
local static_page_server = require("static_page_server")

local is_api = ngx.var.uri:match("^/api/")
if is_api then
    api_proxy("http://127.0.0.1:5000")
else
    local subdomain = ngx.var.subdomain
    local domain = ngx.var.domain
    local base_path = "/home/mikelis.kalme/webserver/domain/" .. domain .. "/" .. subdomain
    local error_base_path = "/home/mikelis.kalme/webserver/error"
    static_page_server(base_path, error_base_path)
end