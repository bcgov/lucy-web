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

        /// Check content structure

        // Should show a list of users
        cy.get('.section-title-text').should('contain', 'All Users');
        cy.get('.mat-table').should('be.visible');

        // Should show "Actions" button for each user
        cy.get('table').get('.mat-row').each($el => {
            cy.wrap($el).should('contain', 'Actions');
        });

        cy.get('table').get('.mat-row').contains('Action').click();
        cy.wait(1000);
        cy.get('#custom-popper').contains('mat-select').click();

        // popper-dropdown

        // Actions button should show a dialog

        // Actions dialog should contain a "roles" dropdown

        // Should have side menu with the following elements
        cy.get('.side-menu').should('contain', 'User Management');
        cy.get('.side-menu').should('contain', 'Content Management');

        // Should have Manage data section
        cy.get('.section-title-text').should('contain', 'Manage Data');

        // Should show Access requests
        cy.get('.section-title-text').should('contain', 'Pending Access Requests');

    });
});
