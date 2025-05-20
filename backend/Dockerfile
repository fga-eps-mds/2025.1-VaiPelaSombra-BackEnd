# Use a base image (e.g., Node.js)
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Clean up to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the rest of the application code
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o projeto
RUN npm run build
# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
