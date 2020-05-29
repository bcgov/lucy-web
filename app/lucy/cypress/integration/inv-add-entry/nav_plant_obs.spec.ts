describe('/add', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });
  });

  it.only('navigates to xx on successful submission', () => {
    cy.visit({
      url: '/add',
    });
    cy.viewport('macbook-15');

    cy.contains('button', 'Invasive Plant Observation').click();
    cy.get('[placeholder="Latitude"]').type('50.12345{enter}');
    cy.get('[placeholder="Longitude"]').type('-120.12345{enter}');

    // Example of expected error message
    // cy.get('.mat-error').should('contain', 'Must be between 48 and 61');

    cy.get('#geometryType').type('Point - Small area circle{enter}');
    cy.get('#mat-input-2').type('100{enter}');
    // since InvasivesBC auto-generates the form, it's better to select on Label
    // rather than auto-generated ID field (example above)
    cy.get('[placeholder="Length"]').type('100{enter}');
    cy.get('[aria-label="Open calendar"]').click();
    cy.get('.mat-calendar-previous-button').click();
    cy.get('.mat-calendar-body-cell').contains('1').click();

    cy.get('#mat-input-7').focus;
    cy.get('#mat-input-7')
      .type(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{enter}
    `);
    cy.get('#generalComment').type(
      `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.{enter}`,
    );

    cy.get('[placeholder="Observer First Name"]').type('John{enter}');
    cy.get('[placeholder="Observer Last Name"]').type('Wile{enter}');

    cy.get('[aria-label="Species"]').type("Baby's breath{enter}");
    cy.get('#completedOnBehalfOf').type('Parks Canada{enter}');
    cy.get('[aria-label="Jurisdiction"]').type('BC Hydro{enter}');
    cy.get('.mat-option-text').contains('BC Hydro ').click({ force: true });
    cy.get('#observationType').type('Cursory{enter}');

    cy.get('#speciesDensity').type('less{enter}');
    cy.get('#speciesDistribution').type('rare{enter}');
    cy.get('#soilTexture').type('c{enter}');
    cy.get('[aria-label="Specific Use Code"]').type('grav{enter}');
    cy.get('#mat-checkbox-5-input').check({ force: true }); // Check checkbox element

    cy.get('[aria-label="Slope Code"]').type('f{enter}');
    cy.get('#aspectCode').type('b{enter}');
    cy.get('#proposedAction').type('e{enter}');
    cy.get('#rangeUnitNumber').type('111{enter}');
    cy.get('#sampleIdentifier').type('112{enter}');

    cy.contains('button', 'Submit Observation ').click();
    cy.contains('button', 'Create Observation ').click();

    // To extract Obs #..
    //    https://stackoverflow.com/questions/56223836/extracting-parts-of-a-text-in-cypress
  });
});
