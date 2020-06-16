describe('/create/mechanical', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });
  });

  it('Dummy placholder test', function () {
    cy.visit({
      url: '/add',
    });
    cy.contains('button', 'Invasive Plant Monitoring (Mechanical)').click();
    expect(true).to.equal(true);
    // cy.location('pathname').should('eq', '/profile');
  });
});
