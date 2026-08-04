# Imagem base oficial do Node.js
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências a partir da pasta Backend
COPY Backend/package*.json ./
COPY Backend/prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o cliente do Prisma ORM
RUN npx prisma generate

# Copia o código do Backend
COPY Backend/ .

# Expõe a porta exigida pelo Hugging Face (7860)
EXPOSE 7860

# Define a variável de ambiente PORT para o Express escutar na 7860
ENV PORT=7860

# Inicia o servidor Node
CMD ["npm", "run", "dev"]