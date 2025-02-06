describe('Rosemary Autocompletion Unit Test', () => {
  beforeEach(() => {
    cy.visit('/'); // Visit the index.html page directly (in the root of the project)
    cy.openRosemary(); // Click the Rosemary button to open the filter panel in Yasgui (UI)
  });

  it('fetch suggestions via AJAX, select one and update DOM with URI', () => {
    cy.intercept('GET', 'https://dbpedia.org/sparql*').as('fetchSuggestions');

    cy.get('#vfpredicate-0').first().click();

    cy.focused()
      .type('birth plac')
      .should('have.value', 'birth plac');

    cy.wait('@fetchSuggestions');

    cy.get('.ui-menu-item')
      .should('have.length.gte', 1)
      .and('contain', 'birth place');

    cy.contains('.ui-menu-item', 'birth place')
      .should('be.visible')
      .click()
      .then(() => {
        cy.focused()
          .should('have.value', 'birth place')
          .then(() => {
            cy.get('#vfpredicate-0')
              .siblings('.hidden-uri')
              .should('exist').should('have.value', 'http://dbpedia.org/ontology/birthPlace');
          });
      });
  });
});
