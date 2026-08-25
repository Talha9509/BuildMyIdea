FROM node:24-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

RUN npm i -g pnpm@10.33.0

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json

COPY ./packages ./packages
COPY ./apps/ws ./apps/ws

RUN pnpm install --filter ws...
RUN pnpm run db:generate
RUN pnpm run build --filter ws... 

EXPOSE 8080

CMD [ "pnpm","run","start:ws" ]