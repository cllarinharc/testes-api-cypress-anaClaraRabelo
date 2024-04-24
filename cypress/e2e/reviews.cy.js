describe("API - /movies", () => {
  let reviewId;
  let token;

  before(() => {
    // Executar login e obter o token
    cy.adminAutenticacao().then(function ({ token: tokenData }) {
      token = tokenData;
    });
  });

  describe("Review filme - Sucesso", () => {
    it("Deve ser possível criar uma review", () => {
      cy.fixture("reviews.json").then((reviews) => {
        cy.request({
          method: "POST",
          url: "/users/review",
          body: reviews.bodyRequestPost,
          headers: {
            Authorization: "Bearer " + token,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
        });
      });
    });
  });
  describe("Review filme - Erro", () => {
    it("Deve retornar erro ao tentar criar uma review invalido", () => {
      cy.request({
        method: "POST",
        url: "/users/review",
        headers: {
          Authorization: "Bearer " + token,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it("Deve retornar erro ao tentar criar uma review sem permissão", () => {
      cy.request({
        method: "POST",
        url: "/users/review",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
    
    it("Deve retornar erro ao tentar uma review", () => {
      cy.fixture("reviews.json").then((reviews) => {
        cy.request({
          method: "POST",
          url: "/users/review",
          body: reviews.bodyRequestPostMovieInvalid,
          headers: {
            Authorization: "Bearer " + token,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  describe("Lista reviews - Sucesso", () => {
    it("Deve ser possível review", () => {
      cy.request({
        method: "GET",
        url: "/users/review/all",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  });

  describe("Lista reviews - Erro", () => {
    it("Não deve ser possível gerar lista de review", () => {
      cy.request({
        method: "GET",
        url: "/users/review/all",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
