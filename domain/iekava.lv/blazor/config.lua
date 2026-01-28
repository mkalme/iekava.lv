package.path = package.path .. ";/home/mikelis.kalme/webserver/script/?.lua"
local api_proxy = require("api_proxy")
api_proxy("http://127.0.0.1:5500")