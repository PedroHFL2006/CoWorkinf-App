FROM node:20-alpine

WORKDIR /app

# Note que apontamos para Backend/
COPY Backend/package*.json ./
COPY Backend/prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY Backend/ .

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "dev"]