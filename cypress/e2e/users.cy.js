import { faker } from "@faker-js/faker";

describe("Teste de API - criação de usuário", () => {
  var baseUrl;
  var fakerPerson;
  var fakerEmail;
  before(() => {
    baseUrl = "https://raromdb-3c39614e42d4.herokuapp.com";
    fakerPerson = faker.person.fullName();
    fakerEmail = faker.internet.email();
  });

  it("Cadastro com sucesso", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/api/users`,
      body: {
        name: fakerPerson,
        email: fakerEmail,
        password: "password123",
      },
    })
      .its("status")
      .should("to.equal", 201);
  });
  describe("Testes de Bad Requests", () => {
    it("Deve receber um 400 ao tentar cadastra com o password vazio ", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/api/users`,
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
    it("Deve receber um 400 ao tentar cadastra com senha menor de 6 dígitos", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/api/users`,
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
    it("Deve receber um 400 ao tentar cadastra com senha maior de 12 dígitos", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/api/users`,
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
});
