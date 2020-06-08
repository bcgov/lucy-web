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
            url: '/inventory',
        });
        cy.viewport('macbook-15');

        /// Check content structure
        // Should have basic search
        cy.get('#mat-input-0').invoke('attr', 'placeholder').should('contain', 'Enter your search here');
        // Should have advanced search
        cy.get('.menu-container').should('contain', 'Advanced Search');
        // Should have Export button
        cy.get('.export-button').should('be.visible');
        // Should show number of records
        cy.get('.table-header-text').should('be.visible');
        // Should show map
        cy.get('.leaflet-container').should('be.visible');
        // Should show table
        cy.get('.mat-table').should('be.visible');
        // Should show map layer buttons
        cy.get('.clickable').should('contain', 'Wells');
        cy.get('.clickable').should('contain', 'Regional districts');
        cy.get('.clickable').should('contain', 'Municipalities');

        // Should show view mode toggles
        cy.get('.toggle-button').should('contain', 'map');
        cy.get('.toggle-button').should('contain', 'view_list');

        /// Interact
        // Toggle view mode
        cy.get('.toggle-button').contains('map').click({ force: true }).then(() => {
            cy.get('.leaflet-container').should('not.be.visible');
            cy.wait(1000);
            cy.get('.toggle-button').contains('map').click({ force: true }).then(() => {
                cy.wait(1000);
                cy.get('.leaflet-container').should('be.visible');
                cy.get('.toggle-button').contains('view_list').click({ force: true }).then(() => {
                    cy.wait(1000);
                    cy.get('.mat-table').should('not.be.visible');
                    cy.get('.toggle-button').contains('view_list').click({ force: true }).then(() => {
                        cy.get('.mat-table').should('be.visible');
                    });
                });
            });
        });

        // Search
        cy.get('[placeholder="Enter your search here"]').first().type('spotted{enter}');
        cy.wait(5000);
        cy.get('table').get('.mat-row').each($el => {
            cy.wrap($el).should('contain', 'Spotted knapweed');
        });

        // Clear search
        cy.get('.mat-icon').contains('close').click();
        cy.get('.mat-icon').should('contain', 'search');
    });
});
