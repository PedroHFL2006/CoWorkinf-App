# Imagem base oficial do Node.js
FROM node:20-alpine

# Cria a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências e do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o cliente do Prisma ORM
RUN npx prisma generate

# Copia o restante dos arquivos do backend
COPY . .

# Expõe a porta exigida pelo Hugging Face (7860)
EXPOSE 7860

# Define a variável de ambiente PORT para o Express escutar na 7860
ENV PORT=7860

# Inicia o servidor Node
CMD ["npm", "run", "dev"]