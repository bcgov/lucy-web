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

        // Should have side menu with the following elements
        cy.get('.side-menu').should('contain', 'User Management');
        cy.get('.side-menu').should('contain', 'Content Management');

        // Should have Manage data section
        cy.get('.section-title-text').should('contain', 'Manage Data');

        // Should show Access requests
        cy.get('.section-title-text').should('contain', 'Pending Access Requests');

        /// Check interactions

        // Should be able to change user role
        cy.get('table').get('.mat-row').each($el => {
            // Change istest 3 role
            if ($el.text().includes('istest3@idir')) {
                const element = cy.wrap($el);
                const isViewer = $el.text().includes('Data Viewer');
                element.contains('Action').click();
                cy.get('.popper-dropdown').click();
                // Change role base on current role
                if (isViewer) {
                    cy.get('.mat-option-text').contains('Officer Mussel Inspect App').click();
                } else {
                    cy.get('.mat-option-text').contains('Data Viewer').click();
                }
                cy.wait(1000);
                // should show a toast message
                cy.get('.toast-container').should('be.visible');
                // close message
                cy.get('.material-icons').contains('close').click();
                // Set istest 3 back to Officer Mussel Inspect App if needed
                cy.wait(1000);
                if (!isViewer) {
                    // Find the element again
                    cy.get('table').get('.mat-row').each($ell => {
                        if ($ell.text().includes('istest3@idir')) {
                            cy.wait(1000);
                            cy.wrap($ell).contains('Action').click();
                            cy.wait(1000);
                            cy.get('.popper-dropdown').click();
                            cy.wait(1000);
                            cy.get('.mat-option-text').contains('Officer Mussel Inspect App').click();
                            cy.wait(1000);
                            // verify
                            cy.get('.toast-container').should('be.visible');
                        }
                    });
                }
            } else if ($el.text().includes('cypress')) {
                // Admins shouldn't be able to change their own access
                cy.wrap($el).get('button').should('be.disabled');
            }
        });
    });
});
