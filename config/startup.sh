sudo systemctl start openresty && \
sudo systemctl start postgresql && \
sudo systemctl enable postgresql && \
(sudo dotnet run --project /home/mikelis.kalme/iekava.lv/webserver/@/api)