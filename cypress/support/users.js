import { METHOD_HTTP } from "./method-http";

Cypress.Commands.add("listaUsuarios1", function (userIdid) {
  cy.request(METHOD_HTTP.GET, "/users").then((response) => {
    return response.body;
  });
});

Cypress.Commands.add("listaUsuarios2", function (userIdid) {
  cy.request(METHOD_HTTP.GET, "/users").then((response) => {
    return response.body;
  });
});
