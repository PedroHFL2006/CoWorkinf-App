# Usa uma imagem do Node.js leve
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia as dependências e instala
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o Hugging Face exige (7860)
EXPOSE 7860

# Inicia o servidor escutando no IP global e na porta 7860
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "7860"]