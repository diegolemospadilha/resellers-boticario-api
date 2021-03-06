<h1 align="center">
    Challenge Backend<br>
    <img alt="GitHub top language" src="http://www.grupoboticario.com.br/Style%20Library/img/header-logo-desktop.png"g" />
</h1>

<h4 align="center">
  API que permite revendedores consultar seus benefícios de acordo com seu volume de vendas
</h4>

<p align="center">
  <a href="https://img.shields.io/github/repo-size/diegolemospadilha/resellers-boticario-api">
    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/diegolemospadilha/resellers-boticario-api">
  </a> 
  <a href="https://img.shields.io/github/languages/top/diegolemospadilha/resellers-boticario-api">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/diegolemospadilha/resellers-boticario-api">
  </a>
  <a href="https://img.shields.io/github/last-commit/diegolemospadilha/resellers-boticario-api">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/diegolemospadilha/resellers-boticario-api">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

<p align="center">
  <a href="#rocket-technologies">Technologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#instalação">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#orange_book-documentação">Documentação da API</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

## :rocket: Tecnologias

Esse projeto foi desenvolvido com base no desafio proposto pelo time do [Grupo Boticário](https://github.com/grupoboticario) com as seguintes tecnologias:

- [Nodejs](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Restify](http://restify.com/)
- [Restify Errors](https://github.com/restify/errors)
- [MongoDB](https://www.mongodb.com/)
- [Mongoosejs](https://mongoosejs.com/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Axios](https://github.com/axios/axios)
- [Supertest](https://github.com/visionmedia/supertest)
- [Jest](https://jestjs.io)
- [Heroku](https://www.heroku.com/)
- [VS Code](https://code.visualstudio.com/) com [ESLint](https://eslint.org/)

## 💻 Instalação

```bash
# Faça o clone do repositório
$ git clone https://github.com/diegolemospadilha/resellers-boticario-api.git

# Acesse o repositorio
$ cd resellers-boticario

# Instale as dependências
$ npm install

# Rode o projeto
# Obs: Para que este comando funcione corretamente é necessário ter o mongodb instalado e inicializado
$ npm start dev

# Executar os testes
$ npm test
```

## :orange_book: Documentação

A documentação da API está disponível [aqui](https://documenter.getpostman.com/view/6657902/SzfB17Kj) e também dentro do diretório /collections.
Esta documentação foi criada utilizando a ferramenta [Postman](https://www.postman.com/). Para visualiza-lá em sua máquina local, primeiramente faça o download do aplicativo.
Na sequência, abra a ferramenta e no canto superior esquerdo clique com o botão na Aba _(Import > Depois arraste o arquivo resellers-boticario.postman_collection para dentro do quadro e Clique em OK)_

Algumas rotas são protegidas e necessitam de um token para acesso. Para gerar um token válido, acesse a rota /resellers/auth e insira um email e senha cadastrado na base. Se não houver nenhum usuário, cadastre manualmente. Há um exemplo na própria documentação.

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---

Feito ♥ by Diego Lemos Padilha :wave: [Entre em contato!](https://www.linkedin.com/in/diegolemospadilha/)
