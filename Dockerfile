FROM node:10.15.1-alpine as frontend-build
WORKDIR /app
RUN apk add make gcc g++ python git
COPY package*.json ./
RUN npm install
COPY . .
ARG NUXT_APP_NODE_URL
ARG NUXT_APP_NODE_WS
ARG NUXT_APP_MDW_URL
ARG NUXT_APP_NETWORK_NAME
ARG NUXT_APP_OTHER_DEPLOYMENTS
ARG NUXT_APP_ENABLE_FAUCET
ARG NUXT_APP_FAUCET_API
RUN NUXT_APP_NETWORK_NAME=$NUXT_APP_NETWORK_NAME NUXT_APP_NODE_URL=$NUXT_APP_NODE_URL NUXT_APP_MDW_URL=$NUXT_APP_MDW_URL NUXT_APP_NODE_WS=$NUXT_APP_NODE_WS NUXT_APP_OTHER_DEPLOYMENTS=$NUXT_APP_OTHER_DEPLOYMENTS NUXT_APP_ENABLE_FAUCET=$NUXT_APP_ENABLE_FAUCET NUXT_APP_FAUCET_API=$FAUCET_API npm run build

FROM node:10.16.3-stretch as frontend
WORKDIR /app
COPY --from=frontend-build /app/.nuxt /app/.nuxt
COPY --from=frontend-build /app/static /app/static
RUN npm install nuxt@2.9.2 @aeternity/aepp-sdk@7.7.0 @download/blockies@1.0.3 clipboard-copy@3.0.0 vue-multiselect@2.1.6 bignumber.js@9.0.0 && \
    npm cache clean --force
COPY package.json package.json
COPY LICENSE.md LICENSE.md
ENV HOST 0.0.0.0
EXPOSE 80
CMD [ "npm", "start" ]
