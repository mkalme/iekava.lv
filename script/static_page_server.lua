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

    local ext = string.match(path, "%.([^%.]+)$")
    if ext then
        ext = string.lower(ext)
        if ext == "html" or ext == "htm" then
            ngx.header["Content-Type"] = "text/html; charset=utf-8"
        elseif ext == "css" then
            ngx.header["Content-Type"] = "text/css; charset=utf-8"
        elseif ext == "js" then
            ngx.header["Content-Type"] = "application/javascript; charset=utf-8"
            ngx.header["Access-Control-Allow-Origin"] = "*"
        elseif ext == "json" then
            ngx.header["Content-Type"] = "application/json; charset=utf-8"
        elseif ext == "png" then
            ngx.header["Content-Type"] = "image/png"
        elseif ext == "jpg" or ext == "jpeg" then
            ngx.header["Content-Type"] = "image/jpeg"
        elseif ext == "gif" then
            ngx.header["Content-Type"] = "image/gif"
        elseif ext == "svg" then
            ngx.header["Content-Type"] = "image/svg+xml"
        elseif ext == "webp" then
            ngx.header["Content-Type"] = "image/webp"
        elseif ext == "ico" then
            ngx.header["Content-Type"] = "image/x-icon"
        elseif ext == "pdf" then
            ngx.header["Content-Type"] = "application/pdf"
        elseif ext == "txt" then
            ngx.header["Content-Type"] = "text/plain; charset=utf-8"
        elseif ext == "woff" or ext == "woff2" then
            ngx.header["Content-Type"] = "font/woff"
        elseif ext == "ttf" then
            ngx.header["Content-Type"] = "font/ttf"
        else
            ngx.header["Content-Type"] = "application/octet-stream"
        end
    else
        ngx.header["Content-Type"] = "application/octet-stream"
    end

    ngx.say(content)
    return ngx.exit(200)
end

return serve_static_page