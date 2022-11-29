# Middleware Frontend (Aeternity explorer)

## Getting started

1. Install the dependencies: `npm install`
2. Run the application:

    - Dev Mode: `npm run dev`
    - Prod: `npm run build && npm start`


## Supported Environment Variables (build argiments)

| Name                  | Description           | Value                                                                             | 
| :---                      |    :----:             |        ----:                                        | 
| `NUXT_APP_NODE_URL`       | Node Api URL          |  (default) `https://mainnet.aeternity.io/v3`  <br/>  `https://testnet.aeternity.io/v3`                 | 
| `NUXT_APP_MDW_URL`        | Middleware Api URL    |  (default) `https://mainnet.aeternity.io/mdw`  <br/> `https://testnet.aeternity.io/mdw`                | 
| `NUXT_APP_NODE_WS`        | Middleware Websocket  |  (default) `wss://mainnet.aeternity.io/mdw/websocket` <br/> `wss://testnet.aeternity.io/mdw/websocket`          | 
| `NUXT_APP_NETWORK_NAME`   | Network Name          |  `MAINNET`                                          | 
| `NUXT_APP_API_DOCS`       | Api Docs              |  `https://github.com/aeternity/ae_mdw#http-endpoints`| 
| `NUXT_APP_ENABLE_FAUCET`  | Enable Faucet         |  (default) `false`| 
| `NUXT_APP_FAUCET_API`     | Faucet Api URL        |  (default) `https://testnet.faucet.aepps.com/account`| 
| `NUXT_APP_OTHER_DEPLOYMENTS` | Other Deployments  |  (default) `TESTNET@https://explorer.testnet.aeternity.io`| 

## Build a docker container (nodeJS server) - recommended

Use `make docker-build` to create a production-ready server container (`aeternity/mdw-frontend`) that uses nodeJS server (it's fast enough). You can use the above env vars to control the build default configuration. The container is runtime configurable by the environment.

The container is universal for any network.

## Build a static Client-only docker container (nginx server)

Alternatively, you could use `make docker-build` to build a static SPA (client-only) nginx server. You have to build a different image for each network.

## Run a docker container

The container is runtime configurable by the environment.
You can use the provided .env files for the official networks `./docker/mainnet.env` and `./docker/testnet.env`

`$NUXT_TARGET` (`server`, `static` - default: `server`) and `$NUXT_SSR` (default: `false`) variables configure the respecting values in `nuxt.config.js`.
You can also configure the server by setting the env var `$PORT` (default: `3000`) and `$HOST` (default: `0.0.0.0`).

Example:

```
docker run --env-file=./docker/testnet.env -e PORT=80 aeternity/mdw-frontend
```
