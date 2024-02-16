# Sistema de agendamento para barbearia - ClickBeard

Funcionalidades
------

Clientes:
* Cadastro (nome, e-mail e senha)
* Login
* Visualizar barbeiros disponíveis e suas respectivas especialidades
* Agendar um horário escolhendo o barbeiro e as especialidades desejadas
* Visualizar, editar e cancelar os seus agendamentos

Admin:
* Cadastrar barbeiro (nome, idade e data da contratação) e suas respectivas especialidades (sobrancelha, corte de tesoura, barba, etc...)
* Visualizar todos os agendamentos do dia atual e os próximos

Regras de negócios
------

* Um barbeiro pode ter mais de uma especialidade.
* Agendamentos todos os dias das 8:00h às 18:00h.
* Um e-mail deve pertencer somente a um cliente.
* Um barbeiro não pode atender dois clientes no mesmo horário
* O cliente pode cancelar um agendamento até 2 horas antes do horário marcado