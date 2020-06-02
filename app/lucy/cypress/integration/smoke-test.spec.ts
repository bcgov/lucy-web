describe('/add', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });
  });

  it('Redirects to Profile on successful login', () => {
    cy.visit({
      url: '/',
    });
    cy.location('pathname').should('eq', '/profile');
  });
});
