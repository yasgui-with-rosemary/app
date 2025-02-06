// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.Commands.add('openRosemary', () => {
    cy.get('.tabPanel.active')      // Select the active tab panel
        .invoke('attr', 'id')         // Get the 'id' attribute
        .then((id) => {
            expect(id).to.exist;
            cy.get('#rosemaryButton-' + id).first().click(); // Click to open rosemary panel
        });
});