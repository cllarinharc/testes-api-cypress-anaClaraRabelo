import { faker } from "@faker-js/faker";

// Cria usuário comum
Cypress.Commands.add("criaUsuarioComum", function () {
  cy.request({
    method: "POST",
    url: "/users",
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password123",
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 201) {
      return response.body;
    }
  });
});

// Realiza login
Cypress.Commands.add("autenticacao", function (user) {
  cy.request({
    method: "POST",
    url: "/auth/login",
    body: {
      email: user.email,
      password: "password123",
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      return { user, token: response.body.accessToken };
    }
    // Cypress.env("token", token);
  });
});

// Define usuário como Admin
Cypress.Commands.add("setAdmin", function ({ user, token }) {
  cy.request({
    method: "PATCH",
    url: "/users/admin",
    headers: {
      Authorization: "Bearer " + token,
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      return { user, token };
    }
  });
});

// Raliza login de usuário no sistema como admin
Cypress.Commands.add("adminAutenticacao", function () {
  cy.criaUsuarioComum().then((user) => {
    cy.autenticacao(user).then(({ user, token }) => {
      cy.setAdmin({ user, token }).then(() => {
        return { user, token };
      });
    });
  });
});

// Raliza login de usuário no sistema comum
Cypress.Commands.add("comumAutenticacao", function () {
  cy.criaUsuarioComum().then((user) => {
    cy.autenticacao(user).then(({ user, token }) => {
      return { user, token };
    });
  });
});

//Deletar usuário do sistema
Cypress.Commands.add("deletarUsuario", function (usersId, token) {
  return cy.request({
    method: "DELETE",
    url: "/users/" + usersId,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
});

// Criar novo Filme no sistema
Cypress.Commands.add("criaNovoFilme", function (token) {
  cy.fixture("movies.json").then((movies) => {
    cy.request({
      method: "POST",
      url: "/movies",
      body: movies.bodyRequestPost,
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      return response.body;
    });
  });
});

// Excluir um filme do sistema
Cypress.Commands.add("excluirFilme", function (movieId, token) {
  cy.request({
    method: "DELETE",
    url: `/movies/${movieId}`,
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((response) => {
    expect(response.status).to.eq(204);
  });
});
