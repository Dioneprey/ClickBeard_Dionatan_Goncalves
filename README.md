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
      "id": "5dde8c70-c8d2-4c83-9013-aa2d15fe5197",
      "barberId": "af479ffa-f5e0-4890-b4ce-ba0ae9b126e9",
      "clientId": "488b8e9a-c696-4e3e-b503-c3eb83d5fffb",
      "day": "2024-02-28T16:30:43.295Z",
      "hour": "13:30",
      "status": "scheduled",
      "createdAt": "2024-02-24T21:38:08.219Z",
      "service": {
        "id": "2d0fcd5d-81ce-4207-8065-23623db0d523",
        "name": "Tesoura",
        "photo": "https://click-beard.s3.sa-east-1.amazonaws.com/click-beard/07a6d144-f6ff-4aeb-9016-28ed09903b1b-9da9dbcc3002c52e52bf8ae5cca429d9.jpg",
        "price": 500,
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
