## Trilha Nodejs Ignite Chapter V Desafio 01 - Transferências com a FinAPI
***
### Sobre o desafio
Nesse desafio você irá implementar uma nova funcionalidade na FinAPI, a aplicação que foi testada durante o desafio Testes unitários.
A nova funcionalidade deverá permitir a transferência de valores entre contas. Para isso, você pode pensar na melhor forma de construir essa solução mas alguns requisitos deverão ser cumpridos:
- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta;
- O balance (obtido através da rota /api/v1/statements/balance) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário; 
- Você pode passar o id do usuário destinatário via parâmetro na rota (exemplo:
- /api/v1/statements/transfers/:user_id) e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;
- Ao mostrar o balance de um usuário, operações do tipo transfer deverão possuir os seguintes campos:
{
  "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
  "amount": 100,
  "description": "Transferência de valor",
  "type": "transfer",
  "created_at": "2021-03-26T21:33:11.370Z",
  "updated_at": "2021-03-26T21:33:11.370Z"
}

#### Rotas da aplicação
- POST /api/v1/users 
A rota recebe name, email e password dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status 201.
- POST /api/v1/sessions
A rota recebe email e password no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.
- GET /api/v1/profile
A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.
- GET /api/v1/statements/balance
A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade balance.
- POST /api/v1/statements/deposit
A rota recebe um token JWT pelo header e amount e description no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status 201.
- POST /api/v1/statements/transfer/:user_id
A rota recebe um token JWT pelo header, amount e description no corpo da requisição e o id do usuário destinatário via parâmetro na rota, registra a operação de transferência do valor e retorna as informações do transferência criado com status 201.
- POST /api/v1/statements/withdraw
A rota recebe um token JWT pelo header e amount e description no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status 201.
- GET /api/v1/statements/:statement_id
A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada
