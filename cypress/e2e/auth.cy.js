describe("Teste de API para login de usuário", () => {
  let name = "ana4";
  let email = "ana4@ana.com";
  let token;
  let userId;

  after(() => {
    cy.request({
      method: "PATCH",
      url: "/api/users/admin",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then(() => {
      cy.request({
        method: "DELETE",
        url: "/api/users/" + userId,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
    });
  });
  it("Cadastro de usuário valido", () => {
    cy.request({
      method: "POST",
      url: `/api/users`,
      body: {
        name: name,
        email: email,
        password: "kaka123",
      },
    }).then((response) => {
      userId = response.body.id;
      expect(response.status).to.eq(201);
      expect(response.body).to.deep.include({
        name: name,
        email: email,
        type: 0,
        active: true,
      });
      expect(response.body).to.have.property("id");
    });
  });
  it("Realizar login com sucesso", () => {
    cy.request({
      method: "POST",
      url: `/api/auth/login`,
      body: {
        email: email,
        password: "kaka123",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      token = response.body.accessToken;
    });
  });
  it("Deve receber um erro ao tentar fazer login com credenciais inválidas", () => {
    cy.request({
      method: "POST",
      url: `/api/auth/login`,
      body: {
        email: "emailInvalido@email.com",
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

  it("Consulta de dados do próprio usuário", () => {
    cy.request({
      method: "GET",
      url: `/api/users/${userId}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.include({
        id: userId,
        name: name,
        email: email,
        type: 0,
        active: true,
      });
    });
  });
});
