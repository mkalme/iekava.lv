sudo systemctl start openresty && \
sudo systemctl start postgresql && \
sudo systemctl enable postgresql && \
(sudo dotnet run --project /home/mikelis.kalme/webserver/domain/iekava.lv/portal/api)