FROM node:12-alpine as frontend-build
WORKDIR /app
RUN apk add g++ python3

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci; npm cache clean --force

COPY . .

RUN NUXT_TARGET=server NUXT_SSR=true npm run build
RUN NUXT_TARGET=static NUXT_SSR=false npm run generate

# make cleaner docker image
FROM node:12-alpine as frontend
WORKDIR /app
RUN apk add make g++ python3 && rm -rf /var/cache/apk/*

RUN mkdir -p /app/dist /app/.nuxt
COPY --from=frontend-build /app/.nuxt /app/.nuxt
COPY --from=frontend-build /app/static /app/static
COPY --from=frontend-build /app/dist /app/dist
COPY LICENSE.md LICENSE.md
COPY package.json package.json

ENV NUXT_TARGET=server
ENV NUXT_SSR=true
ENV NODE_ENV=production
ENV HOST="0.0.0.0"

RUN npm install --only=prod && npm cache clean --force

VOLUME /app/.nuxt /app/dist

EXPOSE 3000

CMD [ "npm", "start" ]
