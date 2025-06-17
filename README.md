# 🔙 2025.1 - VaiPelaSombra Backend

Este repositório contém o código-fonte do backend do projeto **VaiPelaSombra**, desenvolvido durante o semestre 2025.1.

## 🛠️ Instalação

Para instalar as dependências do projeto, execute:

```bash
cd backend
npm install
```

## 🚀 Executando o servidor

Após instalar as dependências, você pode iniciar o servidor de desenvolvimento com:

1- Montar o docker com uma instancia postgres
```bash
docker-compose up -d
```

2- No navegador acesse http://localhost:8080
```bash
username: admin@admin.com
password: admin
```

3- Clique com o direito em "Servers" -> "Register" -> "Server..."
```bash
Geral -> Name: VaiPelaSombra 
Connection -> Host: vai-pela-sombra-db
              Port: 5432
              Username: postgres
              Password: postgres
```
Com isso é possível visualizar as tabelas do banco e suas tuplas

4- Crie as tabelas no banco que está rodando localmente
```bash
npm run migrate:dev
npm run prisma:generate
```

5- Popule o banco de dados

```bash
npm run seed
```

6- Inicie a API localemente
```bash
npm run dev
```

## Erros
Caso o acontece de aparecer o erro: 
"- Drift detected: Your database schema is not in sync with your migration history."

Pode ser que seu banco tenha subido com um histórico diferente ou usando outra migrations 
para garantir que o banco esteja alinhado com as migrations, execute os comandos 

```bash
docker-compose down
docker-compose down -v
docker-compose up -d
npm run migrate:dev
```


## 📦 Scripts disponíveis

| Comando     | Descrição                                                         |
| ----------- | ----------------------------------------------------------------- |
| npm install | Instala todas as dependências do projeto                          |
| npm run dev | Inicia o servidor de desenvolvimento com nodemon (se configurado) |
