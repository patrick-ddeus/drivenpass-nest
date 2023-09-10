<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# DrivenPass - Gerenciador de Senhas

O DrivenPass é um gerenciador de senhas desenvolvido em NestJS que permite aos usuários armazenar com segurança suas informações de login, como credenciais de sites, notas seguras e detalhes de cartões de crédito/débito. Este projeto é inspirado em gerenciadores de senha populares como 1Password, BitWarden e LastPass.

## Banco de Dados

O DrivenPass utiliza o banco de dados relacional PostgreSQL para armazenar com segurança as informações dos usuários. O esquema do banco de dados é projetado para garantir a integridade e a segurança dos dados.

## Tecnologias
Tecnologias utilizadas para desenvolver o projeto:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## Rotas

### Health

- **Rota**: `/health`
- **Descrição**: Rota para verificar o status da aplicação.
- **Método**: GET
- **Resposta**: Retorna a mensagem `“I’m okay!”` com o status code `200 OK`.

### Usuários

- **Rota**: `/users`
- **Descrição**: Rota para gerenciar contas de usuário.
- **Criação de Contas**:
  - Um usuário pode criar uma conta fornecendo um e-mail válido e uma senha segura. A senha precisa ter pelo menos 10 caracteres, incluindo pelo menos 1 número, 1 letra minúscula, 1 letra maiúscula e 1 caractere especial.
  - A senha é armazenada criptografada no banco de dados.
  - Se o e-mail já estiver em uso, a criação da conta será impedida (status `409 Conflict`).
- **Acesso de uma Conta**:
  - O usuário pode fazer login usando o e-mail e a senha cadastrados.
  - Após um login bem-sucedido, o usuário recebe um token JWT para autenticação em requisições futuras.

### Credenciais

- **Rota**: `/credentials`
- **Descrição**: Rota para gerenciar informações de login para sites e serviços.
- **Criação de Credenciais**:
  - O usuário pode registrar uma nova credencial fornecendo uma URL, nome de usuário e senha.
  - Cada credencial deve ter um título exclusivo.
  - A senha é armazenada criptografada usando um segredo da aplicação.
- **Busca de Credenciais**:
  - O usuário pode obter todas as credenciais ou uma específica (por ID).
  - As credenciais retornadas têm suas senhas descriptografadas.
- **Deleção de Credenciais**:
  - O usuário pode excluir uma credencial fornecendo seu ID.

### Notas Seguras

- **Rota**: `/notes`
- **Descrição**: Rota para gerenciar informações de texto livre.
- **Criação de Notas Seguras**:
  - O usuário pode criar uma nova nota segura fornecendo um título e o conteúdo da nota.
  - Cada nota deve ter um título exclusivo.
- **Busca de Notas Seguras**:
  - O usuário pode obter todas as notas seguras ou uma específica (por ID).
- **Deleção de Notas Seguras**:
  - O usuário pode excluir uma nota segura fornecendo seu ID.

### Cartões

- **Rota**: `/cards`
- **Descrição**: Rota para gerenciar informações de cartões de crédito/débito.
- **Criação de Cartões**:
  - O usuário pode registrar um novo cartão fornecendo detalhes como número, nome impresso, código de segurança, data de expiração, senha, tipo (cr

## Como Executar

1. Clone este repositório.

2. Instale as dependências:

    ```bash
    npm i
    ```

3. Execute com o comando:

    ```bash
    npm start
    ```

6. Opcionalmente, você pode construir o projeto com o comando:

    ```bash
    npm run build
