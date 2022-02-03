# Middleware Frontend

## Getting started

1. Install the dependencies: `npm install`
2. Run the application:

    - Dev Mode: `npm run dev`
    - Prod: `npm run build && npm start`


## Supported Environment Variables

| Name                  | Description           | Value                                                                             | 
| :---                      |    :----:             |        ----:                                        | 
| `NUXT_APP_NODE_URL`       | Node Api URL          |  (default) `https://mainnet.aeternity.io/v3`  <br/>  `https://testnet.aeternity.io/v3`                 | 
| `NUXT_APP_MDW_URL`        | Middleware Api URL    |  (default) `https://mainnet.aeternity.io/mdw`  <br/> `https://testnet.aeternity.io/mdw`                | 
| `NUXT_APP_NODE_WS`        | Middleware Websocket  |  (default) `wss://mainnet.aeternity.io/mdw/websocket` <br/> `wss://testnet.aeternity.io/mdw/websocket`          | 
| `NUXT_APP_NETWORK_NAME`   | Network Name          |  `MAINNET`                                          | 
| `NUXT_APP_API_DOCS`       | Api Docs              |  `https://github.com/aeternity/ae_mdw#http-endpoints`| 
| `NUXT_APP_ENABLE_FAUCET`  | Enable Faucet         |  (default) `false`| 
| `NUXT_APP_FAUCET_API`     | Faucet Api URL         |  (default) `https://testnet.faucet.aepps.com/account`| 
| `NUXT_APP_OTHER_DEPLOYMENTS`     | Other Deployments        |  (default) `TESTNET@https://explorer.testnet.aeternity.io`| 
