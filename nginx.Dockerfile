FROM nginx:1.21.3-alpine
WORKDIR /app
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY /tmp/workspace/dist /usr/share/nginx/html
COPY LICENSE.md /usr/share/nginx/html
