# Usa uma imagem do Node.js leve
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências e do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o cliente do Prisma ORM
RUN npx prisma generate

# Copia o restante dos arquivos da API
COPY . .

# Expõe a porta que a API usa (3000)
EXPOSE 3000

# Inicia o servidor Node/Express
CMD ["npm", "run", "dev"]