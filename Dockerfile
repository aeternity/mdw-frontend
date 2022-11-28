FROM node:12-alpine as frontend-build
WORKDIR /app
RUN apk add make gcc g++ python3 git

ARG NUXT_APP_NODE_URL=https://mainnet.aeternity.io/v3
ARG NUXT_APP_NODE_WS=wss://mainnet.aeternity.io/mdw/websocket
ARG NUXT_APP_MDW_URL=https://mainnet.aeternity.io/mdw
ARG NUXT_APP_NETWORK_NAME=MAINNET
ARG NUXT_APP_OTHER_DEPLOYMENTS=TESTNET@https://explorer.testnet.aeternity.io
ARG NUXT_APP_ENABLE_FAUCET=false
ARG NUXT_APP_FAUCET_API=
ARG NUXT_APP_API_DOCS=
ARG NUXT_TARGET=server
ARG NUXT_SSR=true
ARG HOST=0.0.0.0
ARG PORT=3000

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci; npm cache clean --force
COPY . .

RUN NUXT_TARGET=server NUXT_SSR=true npm run build
RUN NUXT_TARGET=static NUXT_SSR=false npm run generate

# make cleaner docker image
FROM node:12-alpine as frontend
WORKDIR /app

ENV NUXT_APP_NODE_URL=${NUXT_APP_NODE_URL}
ENV NUXT_APP_NODE_WS=${NUXT_APP_NODE_WS}
ENV NUXT_APP_MDW_URL=${NUXT_APP_MDW_URL}
ENV NUXT_APP_NETWORK_NAME=${NUXT_APP_NETWORK_NAME}
ENV NUXT_APP_OTHER_DEPLOYMENTS=${NUXT_APP_OTHER_DEPLOYMENTS}
ENV NUXT_APP_ENABLE_FAUCET=${NUXT_APP_ENABLE_FAUCET}
ENV NUXT_APP_FAUCET_API=${NUXT_APP_FAUCET_API}
ENV NUXT_APP_API_DOCS=${NUXT_APP_API_DOCS}
ENV NUXT_TARGET=${NUXT_TARGET}
ENV NUXT_SSR=${NUXT_SSR}
ENV HOST=${HOST}
ENV PORT=${PORT}
ENV NODE_ENV=production

RUN mkdir -p /app/dist /app/.nuxt
COPY --from=frontend-build /app/.nuxt /app/.nuxt
COPY --from=frontend-build /app/static /app/static
COPY --from=frontend-build /app/dist /app/dist
COPY LICENSE.md LICENSE.md

COPY package.json package.json
RUN npm install --only=prod \
    && npm audit fix\
    && npm cache clean --force

VOLUME /app/.nuxt /app/dist
EXPOSE ${PORT}

CMD [ "npm", "start" ]
