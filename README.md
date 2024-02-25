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
- SSE ( Server-sent events ) - Mantendo a página de agendamentos sempre atualizada em tempo real
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
npm run start:dev 
```
# Rotas da API

### Autenticação

<details>
 <summary><code>POST</code> <code><b>/sessions</b></code> <code>(Faz login na aplicação)</code></summary>

##### Parâmetros

```json
{
  "email": "admin@clickbeard.com",
  "password": "senha"
}
```

##### Resposta

```json
{
  "accessToken": "access_token_gerado"
}
```
</details>

### Contas

<details>
 <summary><code>POST</code> <code><b>/accounts</b></code> <code>(Registra uma conta de cliente)</code></summary>

##### Parâmetros

```json
{
  "name": "nome do cliente",
  "email": "cliente@email.com",
  "password": "senha"
}
```
</details>

<details>
 <summary><code>GET</code> <code><b>/accounts</b></code> <code>(Pega informações da conta do cliente logado)</code></summary>

##### Resposta

```json
{
  "user": {
    "id": "uuid",
    "name": "nome do cliente",
    "email": "cliente@email.com",
    "role": "client",
    "createdAt": "Date"
  }
}
```
</details>

### Especialidades

<details>
 <summary><code>POST</code> <code><b>/specialities</b></code> <code>(Registra uma especialidade)</code></summary>

##### Parâmetros

```json
{
    "name": "Corte na tesoura",
    "price": 30,
    "photo": ""
}
```

##### Resposta

```json
{
  "specialityId": "uuid"
}
```
</details>

<details>
 <summary><code>GET</code> <code><b>/specialities</b></code> <code>(Busca todas as especialidades)</code></summary>

##### Resposta

```json
{
  "specialities": [
    {
      "id": "uuid",
      "name": "Corte na tesoura",
      "photo": "",
      "price": 30,
      "time": "00:30"
    }
  ]
}
```
</details>

<details>
 <summary><code>POST</code> <code><b>/specialities/upload</b></code> <code>(Faz upload da imagem da especialidade)</code></summary>

##### Parâmetros

FormData ( Obrigatório )
```
file: File
fileName: nome do arquivo
specialityId: UUID
```
</details>

### Barbeiros

<details>
 <summary><code>POST</code> <code><b>/barbers</b></code> <code>(Registra um barbeiro)</code></summary>

##### Parâmetros

```json
{
  "name": "UUID",
  "birthDate": "Date",
  "hiringDate": "Date",
  "specialities": ["UUID"]
}
```

##### Resposta

```json
{
  "barberId": "uuid"
}
```
</details>

<details>
 <summary><code>GET</code> <code><b>/barbers</b></code> <code>(Busca todos os barbeiro)</code></summary>

##### Parâmetros

```json
{
  "name": "name",
  "birthDate": "Date",
  "hiringDate": "Date",
  "specialities": ["UUID"]
}
```

##### Resposta

```json
{
  "barbers": [
    {
      "id": "UUID",
      "name": "name",
      "hiringDate": "Date",
      "birthDate": "Date",
      "specialities": [
        {
          "id": "UUID",
          "name": "name",
          "photo": "",
          "price": 0,
          "time": "00:30"
        }
      ]
    }
  ]
}
```
</details>

<details>
 <summary><code>PATCH</code> <code><b>/barbers</b></code> <code>(Edita um barbeiro)</code></summary>

##### Parâmetros

```json
{
  "id": "UUID",
  "name": "name",
  "birthDate": "Date",
  "hiringDate": "Date",
  "removePhoto": "Boolean",
  "specialities": ["UUID"]
}
```

##### Resposta

```json
{
  "barberId": "uuid"
}
```
</details>

<details>
 <summary><code>GET</code> <code><b>/barbers/available-slots</b></code> <code>Busca horários de atendimento vagos</code></summary>

##### Parâmetros

Query params ( Obrigatório )
```
available-slots?barberId={UUID}&date={Date}
```

##### Resposta

```json
{
    "availableSlots": [ "hora" ]
}
```
</details>

<details>
 <summary><code>POST</code> <code><b>/barbers/upload</b></code> <code>(Faz upload da imagem do barbeiro)</code></summary>

##### Parâmetros

FormData ( Obrigatório )
```
file: File
fileName: nome do arquivo
barberId: UUID
```
</details>

### Agendamentos

<details>
 <summary><code>POST</code> <code><b>/appointments</b></code> <code>(Registra um agendamento)</code></summary>

##### Parâmetros

```json
{
  "barberId": "UUID",
  "day": "Date",
  "hour": "00:00",
  "appointmentServiceId": "UUID"
}
```
</details>

<details>
 <summary><code>GET</code> <code><b>/appointments</b></code> <code>(Busca os agendamentos (clientes buscam apenas seus agendamentos, admin busca todos os agendamentos))</code></summary>

  ##### Resposta

```json
{
  "appointments": [
    {
      "id": "UUID",
      "barberId": "UUID",
      "clientId": "UUID",
      "day": "Date",
      "hour": "13:30",
      "status": "scheduled",
      "createdAt": "Date",
      "service": {
        "id": "UUID",
        "name": "Tesoura",
        "photo": "",
        "price": 30,
        "time": "00:30"
      }
    }
  ]
}
```
</details>

<details>
 <summary><code>PATCH</code> <code><b>/appointments/:appointmentId/cancel</b></code> <code>(Cancela um agendamento)</code></summary>

##### Parâmetros

Params ( Obrigatório )
```
appointmentId: String
```

</details>
