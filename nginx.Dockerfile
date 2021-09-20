FROM nginx:1.21.3-alpine
COPY ./dist .
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
COPY LICENSE.md /usr/share/nginx/html
