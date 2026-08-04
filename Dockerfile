# Imagem base oficial do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do package.json e da pasta prisma a partir do Backend
COPY Backend/package*.json ./
COPY Backend/prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o cliente do Prisma ORM
RUN npx prisma generate

# Copia todo o restante do código da pasta Backend
COPY Backend/ .

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Define a variável de ambiente para o Express escutar na porta correta
ENV PORT=3000

# Inicia o servidor Node
CMD ["npm", "run", "dev"]