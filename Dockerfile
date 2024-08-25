FROM node:20.17-alpine3.19
WORKDIR /usr/src/app
COPY package*.json ./
ENV DATABASE_URL="postgres://avnadmin:AVNS_PKsMxlZbP-dXGqREYIh@pg-21ddf029-abhiseknaulae-6f1a.h.aivencloud.com:25286/defaultdb?sslmode=require"
ENV PORT=3005
ENV ZEGO_API_ID=1641008969
ENV ZEGO_SERVER_ID="f72b270b8d0d3b9d502efed996d05e30"
RUN npm install
COPY . .
RUN npm install @prisma/client
RUN npx prisma db push
RUN npx prisma generate
EXPOSE 3005
CMD ["node","index.js"]