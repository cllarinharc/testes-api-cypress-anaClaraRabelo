describe("API - /movies", () => {
  let movieId;
  let token;

  before(() => {
    // Executar login e obter o token
    cy.adminAutenticacao().then(function ({ token: tokenData }) {
      token = tokenData;
    });
  });

  describe("Consulta de filmes - Sucesso", () => {
    it("Deve consultar lista de filme no sistema", () => {
      cy.request({
        method: "GET",
        url: "/movies",
      }).then((response) => {
        expect(response.status).to.be.eq(200);
        expect(response.body).to.be.an("array");
        cy.wrap(response.body[0].id).as("filmeId");

        movieId = response.body[0].id;
      });
    });

    it("Deve consultar filme no sistema por id", () => {
      cy.request({
        method: "GET",
        url: `/movies/${movieId}`,
      }).then((response) => {
        expect(response.status).to.be.eq(200);
        expect(response.body).to.exist;
        expect(response.body.id).to.equal(movieId);
        expect(response.body).to.have.property("reviews");
      });
    });
  });

  describe("Criação de filme - Sucesso", () => {
    it("Deve ser possível criar um filme", () => {
      cy.fixture("movies.json").then((movies) => {
        cy.request({
          method: "POST",
          url: "/movies",
          body: movies.bodyRequestPost,
          headers: {
            Authorization: "Bearer " + token,
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property("id");
          movieId = response.body.id;
        });
      });
    });
  });

  describe("Criação de filme - Error", () => {
    // Foi encontrado um erro na API. Na documentação indica que um erro de Bad request deve possuir status code 400, porem esta retornando 404, indicando que não foi encontrado que não é o caso.
    it("Deve retornar erro ao tentar criar um filme inválido", () => {
      cy.request({
        method: "POST",
        url: "/movies",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
      });
    });
  });

  describe("Edição de filme - Sucesso", () => {
    it("Deve ser possível editar um filme", () => {
      cy.fixture("movies.json").then((movies) => {
        cy.request({
          method: "PUT",
          url: `/movies/${movieId}`,
          headers: {
            Authorization: "Bearer " + token,
          },
          body: movies.bodyRequestPut,
        }).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });
  });

  describe("Edição de filme - Erro", () => {
    it("Deve ocorrer erro quando um filme não encontrado ", () => {
      cy.fixture("movies.json").then((movies) => {
        const movieInvalid = 9999999;

        cy.request({
          method: "PUT",
          url: `/movies/${movieInvalid}`,
          headers: {
            Authorization: "Bearer " + token,
          },
          body: movies.bodyRequestPatch,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
          expect(response.body.message).to.eq(movies.bodyResposeErro.message);
        });
      });
    });

    it("Deve ocorrer erro quando os parmetros não são inviados corretamente", () => {
      cy.fixture("movies.json").then((movies) => {
        cy.request({
          method: "PUT",
          url: `/movies/${movieId}`,
          headers: {
            Authorization: "Bearer " + token,
          },
          body: {},
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq(movies.bodyResposeErro.message);
        });
      });
    });
  });

  describe("Deleção de filme - Sucesso", () => {
    it("Deve ser possível deletar um filme", () => {
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
  });
});
