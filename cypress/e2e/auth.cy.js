describe("API - /auth", () => {
  let token;
  let userId;

  after(() => {
    cy.request({
      method: "PATCH",
      url: "/users/admin",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      cy.request({
        method: "DELETE",
        url: "/users/" + userId,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    });
  });

  describe("Autenticação de usuário - Sucesso", () => {
    it("Cadastro de usuário valido", () => {
      cy.fixture("users.json").then((users) => {
        cy.request({
          method: "POST",
          url: `/users`,
          body: users.bodyRequestPost,
        }).then((response) => {
          userId = response.body.id;
          expect(response.status).to.eq(201);
          expect(response.body).to.deep.include(users.bodyResponsePost);
          expect(response.body).to.have.property("id");
        });
      });
    });

    it("Deve realizar login com sucesso", () => {
      cy.fixture("users.json").then((users) => {
        cy.request({
          method: "POST",
          url: `/auth/login`,
          body: users.bodyRequestPostLogin,
        }).then((response) => {
          expect(response.status).to.equal(200);
          token = response.body.accessToken;
        });
      });
    });
  });
  describe("Autenticação de usuário - Error", () => {
    it("Deve receber um erro ao tentar fazer login com credenciais inválidas", () => {
      cy.fixture("users.json").then((users) => {
        cy.request({
          method: "POST",
          url: `/auth/login`,
          body: {
            email: users.bodyRequestPost.email,
            password: "senhaInvalida",
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(401);
          expect(response.body)
            .to.have.property("message")
            .that.includes("Invalid username or password");
        });
      });
    });
  });
  describe("Consulta de usuário logado - Sucesso", () => {
    it("Deve consultar os dados do próprio usuário", () => {
      cy.fixture("users.json").then((users) => {
        cy.request({
          method: "GET",
          url: `/users/${userId}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.deep.include({
            id: userId,
            type: 0,
            active: true,
          });
        });
      });
    });
  });
});
