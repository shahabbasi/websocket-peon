FROM node:18-alpine AS builder

WORKDIR /usr/app

ADD package.json ./

RUN yarn

ADD src ./src
ADD tsconfig.json ./

RUN npm run build


FROM node:18-alpine

WORKDIR /usr/app

RUN yarn add pm2

ADD ecosystem.config.js ./

COPY --from=builder /usr/app /usr/app

CMD ["npx", "pm2", "start", "ecosystem.config.js", "--no-daemon"]
