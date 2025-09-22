if ngx.var.host == "www.iekava.lv" then
    return ngx.redirect("https://iekava.lv" .. ngx.var.request_uri, 301)
end