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

# Install dependencies
RUN npm install

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy the rest of the application
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Compile the project
RUN npm run build