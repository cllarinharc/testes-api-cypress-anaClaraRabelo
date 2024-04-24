import { faker } from "@faker-js/faker";

describe("API - /USERS", () => {
  let userId;
  let userServant;
  let fakerPerson = faker.person.fullName();
  let fakerEmail = faker.internet.email();

  describe("Criação de usuário - Sucesso", function () {
    // after(function () {
    //   cy.deletarUsuario(userServant.userId);
    // });'

    it("Deve ser possível cadastro novo usuário com sucesso", () => {
      cy.request({
        method: "POST",
        url: `/users`,
        body: {
          name: fakerPerson,
          email: fakerEmail,
          password: "password123",
        },
      }).then(function (response) {
        expect(response.status).to.equal(201);
        expect(response.body).have.property("id");
        expect(response.body.name).to.equal(fakerPerson);
        expect(response.body.email).to.equal(fakerEmail);

        userId = response.body.id;
        userServant = response.body;
      });
    });
  });

  describe("Criação de usuário - Erros", function () {
    it("Deve receber status code 400 ao tentar cadastrar com o password vazio ", () => {
      cy.request({
        method: "POST",
        url: `/users`,
        body: {
          name: fakerPerson,
          email: fakerEmail,
          password: " ",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
      });
    });

    it("Deve receber status code 400 ao tentar cadastrar com senha menor de 6 dígitos", () => {
      cy.request({
        method: "POST",
        url: `/users`,
        body: {
          name: fakerPerson,
          email: fakerEmail,
          password: "123",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.include({
          error: "Bad Request",
          message: ["password must be longer than or equal to 6 characters"],
        });
      });
    });

    it("Deve receber status code 400 ao tentar cadastrar com senha maior de 12 dígitos", () => {
      cy.request({
        method: "POST",
        url: `/users`,
        body: {
          name: fakerPerson,
          email: fakerEmail,
          password: "1234567891234",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.include({
          error: "Bad Request",
          message: ["password must be shorter than or equal to 12 characters"],
        });
      });
    });
  });

  describe("Consulta de usuários - Sucesso", function () {
    let token;

    before(() => {
      // Executar login e obter o token
      cy.adminAutenticacao().then(function (data) {
        token = data?.token;
      });
    });

    it("Deve consultar os dados de um usuário pelo id", function () {
      cy.request({
        method: "GET",
        url: `/users/${userId}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(userId);
        expect(response.body.name).to.equal(fakerPerson);
        expect(response.body.email).to.equal(fakerEmail);
      });
    });

    it("Deve consultar a lista de todos os usuários com sucesso", function () {
      cy.request({
        method: "GET",
        url: "/users",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.deep.includes(userServant);

        response.body.forEach(function (usuario) {
          cy.log(usuario.userId);
          if (usuario.id === userServant.id) {
            expect(usuario.email).to.equal(userServant.email);
          }
        });
      });
    });
  });

  describe("Consulta de usuários - Erros", function () {
    let token;

    before(() => {
      // Executar login e obter o token
      cy.adminAutenticacao().then(function (data) {
        token = data?.token;
      });
    });

    it("Não deve ser possível consultar um usuário não cadastrado", function () {
      const userIdInvalid = 999997;

      cy.request({
        method: "GET",
        url: `/users/${userIdInvalid}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.empty;
      });
    });
  });
});
