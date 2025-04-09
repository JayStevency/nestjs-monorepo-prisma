FROM node:20-alpine AS base

RUN apk add --no-cache openssl

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY ../../package.json ../../pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN ls -al
RUN npx prisma generate
RUN pnpm run build:backend
RUN pnpm prune --prod


FROM base AS deploy

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

CMD ["pnpm", "run", "start:backend" ]
