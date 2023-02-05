FROM node:18-alpine AS builder

WORKDIR /usr/app

ADD package.json ./

RUN yarn

ADD src ./
ADD tsconfig.json ./

RUN npm run build


FROM node:18-alpine

WORKDIR /usr/app

RUN yarn add pm2

COPY --from=builder /usr/app/dist /usr/app/

