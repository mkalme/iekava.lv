local function serve_static_page(base_url, error_base_url)
    local function serve_error_page(code)
        local error_page_path = error_base_url .. "/" .. tostring(code) .. ".html"
        local default_error_path = error_base_url .. "/default.html"

        local file = io.open(error_page_path, "rb")
        if not file then
            file = io.open(default_error_path, "rb")
        end

        if file then
            ngx.status = code
            local content = file:read("*a")
            file:close()
            ngx.header["Content-Type"] = "text/html"
            ngx.say(content)
            return ngx.exit(code)
        else
            ngx.status = code
            ngx.say(code .. " Error")
            return ngx.exit(code)
        end
    end

    local path = base_url .. ngx.var.uri

    local file_attr = io.popen("[ -d '" .. path .. "' ] && echo dir || echo file"):read("*l")
    if file_attr == "dir" then
        path = path .. "/index.html"
    end

    local file, err = io.open(path, "rb")
    if not file then
        return serve_error_page(404)
    end

    local content = file:read("*a")
    file:close()

    if path:match("%.html$") then
        ngx.header["Content-Type"] = "text/html"
    elseif path:match("%.css$") then
        ngx.header["Content-Type"] = "text/css"
    elseif path:match("%.js$") then
        ngx.header["Content-Type"] = "application/javascript"
    else
        ngx.header["Content-Type"] = "application/octet-stream"
    end

    ngx.say(content)
    return ngx.exit(200)
end

return serve_static_page