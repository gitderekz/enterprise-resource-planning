# BACKEND
cd project/backend
nano /etc/nginx/sites-available/enterprise-resource-planning-api.gexperten.tech.conf
server {
    listen 80;
    server_name enterprise-resource-planning-api.gexperten.tech;

    # WebSocket support for socket.io
    location /socket.io/ {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    
    location / {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
ln -s /etc/nginx/sites-available/enterprise-resource-planning-api.gexperten.tech.conf /etc/nginx/sites-enabled/
certbot --nginx -d enterprise-resource-planning-api.gexperten.tech
# MWISHO BACKEND
nano /etc/nginx/sites-available/enterprise-resource-planning.gexperten.tech.conf
server {
    listen 80;
    server_name enterprise-resource-planning.gexperten.tech;

    location / {
        root /var/www/enterprise-resource-planning/frontend/out;
        try_files $uri /index.html;
    }
}
ln -s /etc/nginx/sites-available/enterprise-resource-planning.gexperten.tech.conf /etc/nginx/sites-enabled/
certbot --nginx -d enterprise-resource-planning.gexperten.tech
enterprise-resource-planning.gexperten.tech


