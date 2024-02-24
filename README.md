# Sistema de agendamento para barbearia - ClickBeard

## Funcionalidades

Clientes:
- Cadastro (nome, e-mail e senha)
- Visualização de barbeiros disponíveis e suas respectivas especialidades
- Agendamento de um horário, escolhendo o barbeiro e a especialidade desejada
- Visualização e cancelamento dos seus agendamentos

Admin:
- Cadastro de barbeiro (nome, idade e data da contratação) e suas respectivas especialidades (sobrancelha, corte de tesoura, barba, etc...)
- Visualização de todos os agendamentos do dia atual e dos próximos

## Algumas das tecnologias utilizadas

### React
- TanStack Query
- TailwindCSS

### Node.js
- Nest.js
- Clean Architecture
- DDD ( Domain-driven design )
- Princípios SOLID
- SSE ( Server-sent events )
- S3
- Redis e Bull
- Prisma ORM
- PostgreSQL
- Testes unitários
- Github Actions - Testes unitários


## Setup

### React

Instalar dependências:
```
npm i 
```

Preencher arquivo .env ( Você pode encontrar o exemplo em .env.example )

Iniciar Projeto:
```
npm run dev 
```

### Node.js
Instalar dependências:
```
npm i 
```

Preencher arquivo .env ( Você pode encontrar o exemplo em .env.example )

Iniciar containers do Docker:
```
docker compose up -d
```

Rodar seed do banco de dados:
```
npm db:seed
```
Conta de administrador gerada pelo seed:
- E-mail: admin@clickbeard.com
- Senha: senha

Iniciar Projeto:
```
npm run dev 
```
