# Aeternal Frontend

## Getting started

1. Git clone the middleware repository
2. Install the dependencies: `npm install`
3. Run the application:

    - Dev Mode: `npm run dev`
    - Prod: `npm run build && npm start`

## Supported Environment Variables

- NUXT_APP_NODE_URL: Middleware url you want the frontend to connect to (default: `https://testnet.aeternity.io/mdw`).
- NUXT_APP_NODE_WS: Middleware websocket url (default: `ws://testnet.aeternity.io/mdw/websocket`).
- NUXT_APP_NETWORK_NAME: Network name to show in the network indicator (default: `TEST NET`).
- NUXT_APP_SWAGGER_HUB: SwaggerHub link to use (default: https://app.swaggerhub.com/apis/sshekhar/aeternal/1.0).
