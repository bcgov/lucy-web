describe('/upload', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });
  });

  it('Dummy placholder test', function () {
    expect(true).to.equal(true);
  });
});
