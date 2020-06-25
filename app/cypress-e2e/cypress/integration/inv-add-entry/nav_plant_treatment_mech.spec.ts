describe('Add or create mechanical treatment', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });
  });

  it.only('navigates to mechanical treatment creation page', () => {
    cy.visit({
      url: '/add',
    });
    cy.viewport('macbook-15');

    const testValues: any = {
      latitude: 56.519839,
      longitude: -123.872261,
      geometryType: 'Plot - Length x{enter}',
      width: 11,
      length: 7,
      applicatorFirstName: 'Homer',
      applicatorLastName: 'Simpson',
      secondaryApplicatorFirstName: 'Ned',
      secondaryApplicatorLastName: 'Flanders',
      contractor: 'CITY OF COQUITLAM{enter}',
      paperFileRef: '34567',
      speciesAgency: 'Ministry of Agriculture{enter}',
      observedSpecies: 'Spotted knapweed - 2018-07',
      mechanicalMethod: 'Digging{enter}',
      mechanicalDisposalMethods: 'Burnt{enter}',
      rootRemoval: 'Unknown{enter}',
      mechanicalSoilDisturbance: 'Medium{enter}',
      issue: 'Fencing{enter}',
      comment: `E2E test generated on ${new Date()}.{enter}`,
      updatedContractor: 'COWICHAN VALLEY{enter}',
      updatedComment: `Record modified in E2E test on ${new Date()}.{enter}`
    };

    // Clicking add mechanical treatment button
    cy.contains('button', 'Invasive Plant Treatment (Mechanical)').click();
    cy.wait(10000);
    cy.url().should('contain', '/create/mechanical');
    cy.get('[placeholder="Latitude"]').type(`${testValues.latitude}{enter}`);
    cy.get('[placeholder="Longitude"]').type(`${testValues.longitude}{enter}`);

    // Geometry and Area section
    cy.get('#geometryType').type(`${testValues.geometryType}`);
    cy.wait(1000);
    cy.get('[placeholder="Width"]').type(`${testValues.width}{enter}`);
    cy.get('[placeholder="Length"]').type(`${testValues.length}{enter}`);

    // Applicator Information section
    cy.get('[placeholder="Applicator First Name"]').type(`${testValues.applicatorFirstName}`);
    cy.get('[placeholder="Applicator Last Name"]').type(`${testValues.applicatorLastName}`);
    cy.get('[placeholder="Secondary Applicator First Name"]').type(`${testValues.secondaryApplicatorFirstName}`);
    cy.get('[placeholder="Secondary Applicator Last Name"]').type(`${testValues.secondaryApplicatorLastName}`);
    cy.get('#contractor').type(`${testValues.contractor}`);

    // Time and Reference section
    cy.get('[aria-label="Open calendar"]').click();
    cy.get('.mat-calendar-previous-button').click();
    cy.get('.mat-calendar-body-cell').contains('1').click();
    cy.get('[placeholder="Paper File Ref"]').type(`${testValues.paperFileRef}`);

    // Treatment Details section
    cy.get('#speciesAgency').type(`${testValues.speciesAgency}`);
    cy.get('#observations').click().then(() => {
      cy.get('[placeholder="Search"]').type(`${testValues.observedSpecies}`);
      cy.get('[id="mat-option-748"]').click({ force: true });
      cy.get('[id="mat-option-758"]').click({ force: true });
      cy.get('[placeholder="Search"]').type('{esc}');
    });


    // Method and techniques section
    cy.get('#mechanicalMethod').type(`${testValues.mechanicalMethod}`);
    cy.get('#mechanicalDisposalMethods').type(`${testValues.mechanicalDisposalMethods}`);
    cy.get('#rootRemoval').type(`${testValues.rootRemoval}`);

    // Issues section
    cy.get('#mechanicalSoilDisturbance').type(`${testValues.mechanicalSoilDisturbance}`);
    cy.get('#issue').type(`${testValues.issue}`);

    // Additional Information section
    cy.get('.mat-checkbox-inner-container').click({ force: true });
    cy.get('#comment').type(`${testValues.comment}`);

    // Submit for review
    cy.contains('button', 'Submit Mechanical Treatment').click({ force: true });
    cy.wait(2000);

    // Confirm creation of treatment
    cy.contains('button', 'Create Mechanical Treatment').click({ force: true });
    cy.wait(10000);

    // Verify URL
    cy.url().should('contain', '/view/mechanical/');
    cy.contains('button', 'Make changes').should('be', true);

    // Make changes to the record
    cy.contains('button', 'Make changes').click({ force: true });
    cy.wait(4000);

    // Verify URL again
    cy.url().should('contain', '/edit/mechanical/');

    // Update a few fields
    cy.get('#contractor').type(`${testValues.updatedContractor}`);
    cy.get('[aria-label="Open calendar"]').click();
    cy.get('.mat-calendar-body-cell').contains('18').click();
    cy.get('#comment').type(`${testValues.updatedComment}`);

    // Review the edits
    cy.contains('button', 'Review Mechanical Treatment').click({ force: true });
    cy.wait(1000);
    cy.contains('button', 'Commit Mechanical Treatment').click({ force: true });
    cy.wait(10000);

    // Verify URL and final output
    cy.url().should('contain', '/view/mechanical/');
    cy.get('#contractor').contains(`${testValues.updatedContractor}`).should('be', true);
    cy.get('app-field[value="-18"]').should('be', true);
    cy.get('#mechanicalMethod').contains(`${testValues.mechanicalMethod}`).should('be', true);
    cy.get('#comment').contains(`${testValues.updatedComment}`).should('be', true);
  });
});
