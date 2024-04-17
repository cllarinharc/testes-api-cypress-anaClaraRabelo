describe("Filme no sistema", () => {
  it("Consulta de lista de filme no sistema e consulta de filme por id", () => {
    cy.request({
      method: "GET",
      url: "/api/movies",
    }).then((response) => {
      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.an("array");
      cy.wrap(response.body[0].id).as("filmeId");
      cy.request({
        method: "GET",
        url: `/api/movies/${response.body[0].id}`,
      }).then((filmeIdUm) => {
        expect(filmeIdUm.status).to.be.eq(200);
        expect(filmeIdUm.body).to.exist;
        expect(filmeIdUm.body.id).to.equal(response.body[0].id);
      });
    });
  });
});
