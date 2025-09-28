# CRUD-FullStack

Este projeto é um sistema CRUD completo, desenvolvido com uma arquitetura Full Stack utilizando Node.js no backend e React no frontend. O objetivo é fornecer uma base sólida para aplicações web modernas, com separação clara entre as camadas de API e interface.

## Estrutura do Repositório

```
CRUD-FullStack/
├── api/         # Backend Node.js (Express)
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   └── package.json
├── frontend/    # Frontend React
│   ├── public/
│   ├── src/
│   ├── build/
│   └── package.json
├── README.md
└── package.json
```

## Pré-requisitos

- Node.js (versão recomendada: 18.x ou superior)
- npm (gerenciador de pacotes do Node)
- Git

## Instalação

Clone o repositório

### Backend (API)

1. Acesse a pasta do backend:
	```powershell
	cd api
	```
2. Instale as dependências:
	```powershell
	npm install
	```

### Frontend (React)

1. Acesse a pasta do frontend:
	```powershell
	cd ../frontend
	```
2. Instale as dependências:
	```powershell
	npm install
	```

## Execução do Projeto

### Backend

Na pasta `api`, execute:

```powershell
npm start
```

O servidor backend será iniciado (por padrão na porta 5000 ou definida no código).

### Frontend

Na pasta `frontend`, execute:

```powershell
npm start
```

A aplicação React será iniciada e estará disponível em `http://localhost:3000`.

## Como Usar

- Acesse o frontend em seu navegador: [http://localhost:3000](http://localhost:3000)
- Realize operações de cadastro, leitura, atualização e exclusão de usuários.
- O frontend se comunica com a API backend para persistência dos dados.

## Scripts Úteis

- `npm start` — Inicia o servidor de desenvolvimento (backend ou frontend)
- `npm run build` — Gera a versão de produção do frontend

## Observações

- Certifique-se de que o backend esteja rodando antes de utilizar o frontend.
- As configurações de conexão com banco de dados podem ser ajustadas em `api/db.js`.

## Link do video no Youtube
https://www.youtube.com/watch?v=5aWz2rZE3o4

## Alunos
Guilherme Galvani Morigi e Nathan Henrique Riffel

## Link do site
https://meucontato-1.onrender.com/