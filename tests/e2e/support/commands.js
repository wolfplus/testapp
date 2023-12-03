// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (phoneNummber, password) => {
  cy.get("[data-test=goToShop]").click({ force: true });
  cy.get("[data-test=inputPhone]").type(phoneNummber, { force: true });
  cy.get("[data-test=confirmPhone]").click({ force: true });
  cy.get("[data-test=inputPassword]").type(password, { force: true });
  cy.get("[data-test=confirmPassword]").click({ force: true });
});

Cypress.Commands.add("iframeLoaded", { prevSubject: "element" }, ($iframe) => {
  const contentWindow = $iframe.prop("contentWindow");
  console.log("iframeLoaded ::: " );
  return new Promise((resolve) => {
    if (contentWindow && contentWindow.document.readyState === "complete") {
      resolve(contentWindow);
    } else {
      $iframe.on("load", () => {
        resolve(contentWindow);
      });
    }
  });
});

Cypress.Commands.add(
  "getInDocument",
  { prevSubject: "document" },
  (document, selector) => Cypress.$(selector, document)
);

Cypress.Commands.add("getWithinIframe", (targetElement) =>
  cy
    .get(".__PrivateStripeElement > iframe")
    .iframeLoaded()
    .its("document")
    .getInDocument(targetElement)
);
