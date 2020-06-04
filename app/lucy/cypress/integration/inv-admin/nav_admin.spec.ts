describe('/inventory', () => {
    beforeEach(() => {
        cy.svcClientLogout();
        cy.svcClientLogin().as('tokens');
        cy.get('@tokens').then((tokens) => {
            cy.svcClientSetCookie(tokens);
        });
    });

    it.only('navigates to inventory page', () => {
        cy.visit({
            url: '/admin',
        });
        cy.viewport('macbook-15');
        
    });
});
