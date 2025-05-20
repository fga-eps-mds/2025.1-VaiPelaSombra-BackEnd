FROM node:20-slim

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# (Opcional) Comando default
CMD ["npm", "run", "start"]
