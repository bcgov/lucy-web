import * as faker from 'faker';


describe('Add or create observation', () => {
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

    const testValues: any = {
      latitude: 50.12345,
      longitude: -120.12345,
      geometryType: 'Point - Small area circle{enter}',
      species: `Baby's breath`,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    };

    // Clicking add Invasive Plant Observation button
    cy.contains('button', 'Invasive Plant Observation').click();
    cy.wait(10000);
    cy.url().should('contain', '/create/observation');
    cy.get('[placeholder="Latitude"]').type(`${testValues.latitude}{enter}`);
    cy.get('[placeholder="Longitude"]').type(`${testValues.longitude}{enter}`);

    // Example of expected error message
    // cy.get('.mat-error').should('contain', 'Must be between 48 and 61');

    cy.get('#geometryType').type('Plot - Length x Area{enter}');
    cy.wait(1000);
    cy.get('[placeholder="Width"]').type('100{enter}', {force : true});
    // since InvasivesBC auto-generates the form, it's better to select on Label
    // rather than auto-generated ID field (example above)
    cy.get('[placeholder="Length"]').type('100{enter}', { force: true});
    cy.get('[aria-label="Open calendar"]').click();
    cy.get('.mat-calendar-previous-button').click();
    cy.get('.mat-calendar-body-cell').contains('1').click();

    cy.get('#mat-input-7').focus();
    cy.get('#mat-input-7')
      .type(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
       incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{enter}
    `);
    cy.get('#generalComment').type(
      `Observation created as e2e test on ${new Date()}.{enter}`,
    );

    cy.get('[placeholder="Observer First Name"]').type(`${testValues.firstName}{enter}`);
    cy.get('[placeholder="Observer Last Name"]').type(`${testValues.lastName}{enter}`);

    // Species
    cy.get('#species').find('[aria-label="Species"]').type(`${testValues.species}{enter}`, { force: true });

    // Agency
    cy.get('#completedOnBehalfOf').find('[aria-label="Completed on Behalf of"]').type('Parks Canada{enter}', { force: true });

    // Jurisdiction
    cy.get('#jurisdiction').find('[aria-label="Jurisdiction"]').type('Ministry of Forests{enter}', { force: true });


    // Observation Type
    cy.get('#observationType')
      .find('[aria-label="Observation Type"]').type('Cursory{enter}', { force: true });

    // Species Density
    cy.get('#speciesDensity').find('[aria-label="Species Density"]').type('2-5 plants per{enter}', { force: true });

    // Species Distribution
    cy.get('#speciesDistribution')
      .find('[aria-label="Species Distribution"]').type('rare individual{enter}', { force: true });

    // Soil texture
    cy.get('#soilTexture').find('[aria-label="Soil Texture"]').type('Coarse{enter}', { force: true });

    // Specific Use code
    cy.get('#specificUseCode').find('[aria-label="Specific Use Code"]').type('Gravel{enter}', { force: true });

    // Slope code
    cy.get('#slopeCode').find('[aria-label="Slope Code"]').type('Nearly flat 1-4{enter}', { force: true });

    // Proposed Action
    cy.get('#proposedAction').find('[aria-label="Proposed Action"]').type('Chemical monitoring{enter}', { force: true });


    // Proposed Action
    cy.get('#aspectCode').find('[aria-label="Aspect Code"]').type('East facing{enter}', { force: true });

    // CheckBoxes
    cy.get('#legacySiteIndicator').find('input[type="checkbox"]').check({ force: true });

    // cy.get('#mat-checkbox-5-input').check({ force: true }); // Check checkbox element



    // Range Unit Number
    cy.get('#rangeUnitNumber').find('[placeholder="Range Unit Number"]').type('11X1{enter}', { force: true });

    // Sample Identifier
    cy.get('#sampleIdentifier').find('[placeholder="Sample Identifier"]').type('1NCC345{enter}', { force: true });


    // Reviewing
    cy.contains('button', 'Submit Observation ').click({ force: true });
    cy.wait(2000);
    // Creating
    cy.contains('button', 'Create Observation ').click({ force: true });
    cy.wait(10000);

    // Verify url
    cy.url().should('contain', '/view/observation');
    // Verify
    cy.contains('button', 'Make changes').should('be', true);

    // Verify in Read mode
    // Latitude
    cy.get('#location').find(`input[value="${testValues.latitude}"]`).should('be', true);

    // Longitude
    cy.get('#location').find(`input[value="${testValues.longitude}"]`).should('be', true);

    // Geometry type
    // cy.get('#geometryType').find(`input[value=${testValues.geometryType}]`).should('be', true);
    // Species


    // Update
    cy.contains('button', 'Make changes').click({ force: true});
    cy.wait(1500);

    // Verify url
    cy.url().should('contain', '/edit/observation');

    // Now update some fields
    const newFirstName = faker.name.firstName();
    const newLastName = faker.name.lastName();

    cy.get('#observerFirstName').find(`input`).should('have.value', testValues.firstName).type(`${newFirstName}{enter}`, { force: true});
    cy.get('#observerLastName').find(`input`).should('have.value', testValues.lastName).type(`${newLastName}{enter}`, { force: true});

    cy.contains('button', 'Review Observation').click({ force: true});
    cy.wait(2000);
    cy.contains('button', 'Commit Observation').click({ force: true});
    cy.wait(10000);
    cy.url().should('contain', '/view/observation');
    cy.get(`input[value="${newFirstName}"]`).should('be', true);
    cy.get(`input[value="${newLastName}"]`).should('be', true);

    // To extract Obs #..
    //    https://stackoverflow.com/questions/56223836/extracting-parts-of-a-text-in-cypress
  });
});
