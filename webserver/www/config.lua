if ngx.var.host:match("^www%.") then
    local domain = ngx.var.host:gsub("^www%.", "")
    return ngx.redirect("https://" .. domain .. ngx.var.request_uri, 301)
end