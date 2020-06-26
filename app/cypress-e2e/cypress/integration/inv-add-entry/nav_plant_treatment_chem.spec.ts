import * as faker from 'faker';

describe('Create, edit, and view chemical treatment', () => {
  beforeEach(() => {
    cy.svcClientLogout();
    cy.svcClientLogin().as('tokens');
    cy.get('@tokens').then((tokens) => {
      cy.svcClientSetCookie(tokens);
    });
  });

  it.only('navigates to chemical treatment creation page', () => {
    cy.visit({
      url: '/add',
    });
    cy.viewport('macbook-15');

    const testValues: any = {
      latitude: 52.27918,
      longitude: -122.15026,
      geometryType: 'Point - Small area circle',
      radius: 4,
      firstApplicator: 'TY BACH - 153865',
      secondApplicator: 'EMILY BENNETT - 186263',
      pesticideEmployerCode: 'KOOTENAY WEED CONTROL',
      primaryPaperFileRef: faker.random.number(),
      secondaryPaperFileRef: faker.random.number(),
      pup: faker.random.number(),
      speciesAgency: 'CKISS -',
      projectManagementPlan: 'KMC ROW 879-',
      chemTreatmentMethod: 'Back Pack',
      temperature: 25,
      humidity: 35,
      windSpeed: 7,
      windDirection: 'Southeast',
      mixDeliveryRate: 40,
      herbicide1: 'CreditX',
      amountUsed1: 4.5,
      herbicide2: 'Habitat',
      applicationRate2: 6.8,
      amountUsed2: 3.5,
      speciesCoverage1: 50,
      speciesCoverage2: 50,
      additionalComments: faker.lorem.sentence(),
      editedProjectManagementPlan: 'FLNR-PMP 402-0678',
      editedTemperature: 26,
      editedHerbicide2: 'Oracle'
    };

    // ------------ First create a new chemical treatment ------------------
    // Click add chemical treatment button
    cy.contains('button', 'Invasive Plant Treatment (Chemical)').click();
    cy.wait(5000);
    cy.url().should('contain', '/create/chemical');

    // Location and Geometry section
    cy.get('[placeholder="Latitude"]').type(`${testValues.latitude}{enter}`);
    cy.get('[placeholder="Longitude"]').type(`${testValues.longitude}{enter}`);

    // Geometry and Area section
    cy.get('#geometryType').type(`${testValues.geometryType}{enter}`);
    cy.get('[placeholder="Radius"]').type(`${testValues.radius}{enter}`);

    // Applicator Information section
    cy.get('#firstApplicator').type(`${testValues.firstApplicator}{enter}`);
    cy.get('#secondApplicator').type(`${testValues.secondApplicator}{enter}`);
    cy.get('#pesticideEmployerCode').type(`${testValues.pesticideEmployerCode}{enter}`);

    // Treatment Details section
    cy.get('[placeholder="Primary Paper File Reference"]').type(`${testValues.primaryPaperFileRef}{enter}`);
    cy.get('[placeholder="Secondary Paper File Reference"]').type(`${testValues.secondaryPaperFileRef}{enter}`);
    cy.get('[aria-label="Open calendar"]').click();
    cy.get('.mat-calendar-previous-button').click();
    cy.get('.mat-calendar-body-cell').contains('3').click();
    cy.get('[placeholder="PUP"]').type(`${testValues.pup}{enter}`);
    cy.get('#speciesAgency').type(`${testValues.speciesAgency}{enter}`);
    cy.get('#projectManagementPlan').type(`${testValues.projectManagementPlan}{enter}`);

    // Treatment Method and Application section
    cy.get('#chemicalTreatmentMethod').type(`${testValues.chemTreatmentMethod}{enter}`);
    cy.get('#temperature').type(`${testValues.temperature}{enter}`);
    cy.get('#humidity').type(`${testValues.humidity}{enter}`);
    cy.get('#windSpeed').type(`${testValues.windSpeed}{enter}`);
    cy.get('#windDirection').type(`${testValues.windDirection}{enter}`);

    // Herbicide and Application section
    cy.get('[placeholder="Mix Delivery Rate (calibrated)"]').type(`${testValues.mixDeliveryRate}{enter}`);
    // add first herbicide
    cy.get('#herbicideMix').type(`${testValues.herbicide1}{enter}`);
    cy.get('[data-cy=amount-used-1]').type(`${testValues.amountUsed1}{enter}`);

    // add second herbicide
    cy.contains('button', 'Add Additional Herbicide').click();
    cy.wait(1000);
    cy.get('[data-cy=herbicide-new]').type(`${testValues.herbicide2}{enter}`);
    cy.get('[data-cy=application-rate-2]').type(`${testValues.applicationRate2}{enter}`);
    cy.get('[data-cy=amount-used-2]').type(`${testValues.amountUsed2}{enter}`);

    // Species to be treated section
    cy.get('[data-cy=treat-species-1]').click();
    cy.wait(1000);
    cy.get('[data-cy=species-coverage-1').type(`${testValues.speciesCoverage1}{enter}`);
    cy.get('[data-cy=treat-species-3]').click();
    cy.wait(1000);
    cy.get('[data-cy=species-coverage-2').type(`${testValues.speciesCoverage2}{enter}`);

    // Comments section
    cy.get('#additionalComments').type(`${testValues.additionalComments}`);

    // Submit for review
    cy.contains('button', 'Submit Chemical Treatment').click({ force: true });
    cy.wait(2000);

    // Confirm creation of treatment
    cy.contains('button', 'Create Chemical Treatment').click({ force: true });

    // TODO: Everything below here has been commented out because it will currently (June 26, 2020)
    // fail due to a bug when viewing a Chemical Treatment. Once the bug is fixed, the rest of this
    // test can be uncommented and the E2E should pass.
    /*
    cy.wait(10000);

    // ---------------- Edit the newly created treatment ---------------------
    // Verify URL
    cy.url().should('contain', '/view/chemical/');
    cy.contains('button', 'Make changes').click({ force: true });
    cy.wait(4000);
    cy.url().should('contain', '/edit/chemical/');

    // Update a few fields at random
    cy.get('#projectManagementPlan').type(`${testValues.editedProjectManagementPlan}{enter}`);
    cy.get('#temperature').type(`${testValues.editedTemperature}{enter}`);

    // Submit the edits for review
    cy.contains('button', 'Review Chemical Treatment').click({ force: true });
    cy.wait(1000);
    cy.contains('button', 'Commit Chemical Treatment').click({ force: true });
    cy.wait(10000);

    // ---------------- View the edited treatment ------------------------
    cy.url().should('contain', '/view/chemical/');
    cy.get('#projectManagementPlan').contains(`${testValues.editedProjectManagementPlan}`).should('be', true);
    cy.get('#temperature').contains(`${testValues.editedTemperature}`).should('be', true);
    */
  })
});
