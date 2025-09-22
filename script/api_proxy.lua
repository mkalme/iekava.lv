local http = require "resty.http"

local function forward_proxy(base_url)
    local httpc = http.new()
    httpc:set_timeout(100000)

    ngx.req.read_body()
    local body = ngx.req.get_body_data()
    local headers = ngx.req.get_headers()

    headers["Host"] = ngx.var.host
    headers["X-Real-IP"] = ngx.var.remote_addr
    headers["X-Forwarded-For"] = ngx.var.http_x_forwarded_for or ngx.var.remote_addr
    headers["X-Forwarded-Proto"] = ngx.var.scheme
    headers["Connection"] = "keep-alive"
    headers["Upgrade"] = ngx.var.http_upgrade or ""
    headers["Proxy-Cache-Bypass"] = ngx.var.http_upgrade or ""

    local res, err = httpc:request_uri(base_url .. ngx.var.request_uri, {
        method = ngx.req.get_method(),
        headers = headers,
        body = body,
        keepalive = true,
    })

    if not res then
        ngx.status = 502
        ngx.say("Bad gateway: ", err)
        ngx.log(ngx.ERR, "Proxy request error: ", err)
        return ngx.exit(502)
    end

    ngx.status = res.status

    for k, v in pairs(res.headers) do
        if k:lower() ~= "transfer-encoding" and k:lower() ~= "connection" then
            ngx.header[k] = v
        end
    end

    ngx.say(res.body)
    return ngx.exit(res.status)
end

return forward_proxy