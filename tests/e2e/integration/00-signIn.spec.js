/// <reference types="cypress" />

context("SignIn", () => {
  beforeEach(() => {
    cy.viewport("iphone-5");
    cy.visit("/");
  });

  describe("SignIn - via go to shop", () => {
    it(".should() - connect user", () => {
      const phoneNummber = "0649172975";
      const password = "12345678";

      cy.get("[data-test=goToShop]").click({ force: true });
      cy.get("[data-test=inputPhone]").type(phoneNummber, { force: true });
      cy.get("[data-test=confirmPhone]").click({ force: true });
      cy.get("[data-test=inputPassword]").type(password, { force: true });
      cy.get("[data-test=confirmPassword]").click({ force: true });
    });
  });
});
