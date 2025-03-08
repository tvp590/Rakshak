FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=build /app/.next ./.next
# COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./

RUN npm install --production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]