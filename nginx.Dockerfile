FROM node:10.15.1-alpine as aepp-mdw-frontend-build
WORKDIR /app
RUN apk add make gcc g++ python git
COPY  . .
RUN npm install
ARG NUXT_APP_NODE_URL
ARG NUXT_APP_NODE_WS
ARG NUXT_APP_NETWORK_NAME
ARG NUXT_APP_ENABLE_FAUCET
ARG NUXT_APP_FAUCET_API
RUN NUXT_APP_NODE_URL=$NUXT_APP_NODE_URL NUXT_APP_NODE_WS=$NUXT_APP_NODE_WS NUXT_APP_NETWORK_NAME=$NUXT_APP_NETWORK_NAME npm run generate

FROM nginx:1.13.7-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=aepp-mdw-frontend-build /app/dist /usr/share/nginx/html
COPY LICENSE.md /usr/share/nginx/html
