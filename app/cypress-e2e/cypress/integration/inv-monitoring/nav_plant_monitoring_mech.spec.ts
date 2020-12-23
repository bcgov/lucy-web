import * as faker from 'faker';

/*
describe('Add or create mechanical monitoring record', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });

    // must make sure there's at least 1 mechanical treatment in DB
    // before creating a new mechanical monitoring record
    createMechanicalTreatment();
  });

  it.only('navigates to mechanical monitoring creation page', () => {
    cy.visit({
      url: '/add',
    });
    cy.viewport('macbook-15');

    const testValues: any = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      onBehalfOf: 'Environment',
      paperFileID: faker.random.alphaNumeric(),
      efficacy: '90',
      comments: faker.lorem.paragraph(),
      updatedEfficacy: '95',
      updatedFirstName: faker.name.firstName(),
      updatedPaperFileID: faker.random.alphaNumeric(),
    };

    // Clicking add mechanical monitoring button
    cy.contains('button', 'Invasive Plant Monitoring (Mechanical)').click();
    cy.wait(10000);
    cy.url().should('contain', '/create/monitor/mechanical');

    // Select mechanical treatment to monitor
    cy.get('#treatmentID').type(`{downarrow}{enter}`);

    // Monitoring Details section
    cy.get('[placeholder="Observer First Name"]').type(`${testValues.firstName}`);
    cy.get('[placeholder="Observer Last Name"]').type(`${testValues.lastName}`);
    cy.get('#completedOnBehalfOf').type(`${testValues.onBehalfOf}{enter}`);
    cy.get('[placeholder="Paper File ID"]').type(`${testValues.paperFileID}`);
    cy.get('[aria-label="Efficacy %"]').type(`${testValues.efficacy}{enter}`);

    // Comments section
    cy.get('#comments').type(`${testValues.comments}`);

    // Submit for review
    cy.contains('button', 'Submit Mechanical Monitoring').click({ force: true });
    cy.wait(2000);

    // Confirm creation of monitoring record
    cy.contains('button', 'Create Mechanical Monitoring').click({ force: true });
    cy.wait(10000);

    // Verify URL
    cy.url().should('contain', '/view/monitor/mechanical/');
    cy.contains('button', 'Make changes').should('be', true);

    // Make changes to the record
    cy.contains('button', 'Make changes').click({ force: true });
    cy.wait(4000);
    cy.url().should('contain', '/edit/monitor/mechanical/');

    // Update a few fields
    cy.get('[placeholder="Observer First Name"]').type(`${testValues.updatedFirstName}`);
    cy.get('[placeholder="Paper File ID"]').type(`${testValues.updatedPaperFileID}`);
    cy.get('[aria-label="Efficacy %"]').type(`${testValues.updatedEfficacy}{enter}`);

    // Review the edits
    cy.contains('button', 'Review Mechanical Monitoring').click({ force: true });
    cy.wait(1000);
    cy.contains('button', 'Commit Mechanical Monitoring').click({ force: true });

    // Verify URL and final output
    cy.url().should('contain', '/view/monitor/mechanical/');
    cy.get('[ng-reflect-header="Observer First Name"]').contains(`${testValues.updatedFirstName}`).should('be', true);
    cy.get('[ng-reflect-header="Observer Last Name"]').contains(`${testValues.lastName}`).should('be', true);
    cy.get('[ng-reflect-header="Paper File ID"]').contains(`${testValues.updatedPaperFileID}`).should('be', true);
    cy.get('[ng-reflect-header="Efficacy %"]').contains(`${testValues.updatedEfficacy}`).should('be', true);
  });

  const createMechanicalTreatment = () => {
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
    cy.visit({ url: '/add' });
    cy.contains('button', 'Invasive Plant Treatment (Mechanical)').click();
    cy.wait(10000);
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
  };
});
*/
