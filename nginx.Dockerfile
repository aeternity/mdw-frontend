FROM node:10.15.1-alpine as aepp-mdw-frontend-build
WORKDIR /app
RUN apk add make gcc g++ python git
COPY  . .
RUN npm install
ARG NUXT_APP_NODE_URL
ARG NUXT_APP_NODE_WS
ARG NUXT_APP_MDW_URL
ARG NUXT_APP_NETWORK_NAME
ARG NUXT_APP_OTHER_DEPLOYMENTS
ARG NUXT_APP_ENABLE_FAUCET
ARG NUXT_APP_FAUCET_API
ARG NUXT_APP_API_DOCS
ENV NUXT_APP_NODE_URL=${NUXT_APP_NODE_URL}
ENV NUXT_APP_NODE_WS=${NUXT_APP_NODE_WS}
ENV NUXT_APP_MDW_URL=${NUXT_APP_MDW_URL}
ENV NUXT_APP_NETWORK_NAME=${NUXT_APP_NETWORK_NAME}
ENV NUXT_APP_OTHER_DEPLOYMENTS=${NUXT_APP_OTHER_DEPLOYMENTS}
ENV NUXT_APP_ENABLE_FAUCET=${NUXT_APP_ENABLE_FAUCET}
ENV NUXT_APP_FAUCET_API=${NUXT_APP_FAUCET_API}
ENV NUXT_APP_API_DOCS=${NUXT_APP_API_DOCS}
ENV NUXT_TARGET=static
ENV NUXT_SSR=false
RUN npm run generate

FROM nginx:1.13.9-alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=aepp-mdw-frontend-build /app/dist /usr/share/nginx/html
COPY LICENSE.md /usr/share/nginx/html
