/// <reference types="cypress" />

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("go to shop page", () => {
    it(".should() - buy a item by wallet and go to home page.", () => {
      cy.get("[data-test=goToShop]").click({ force: true });
      cy.get("[data-test=goToCart]", { force: true }).should("exist");
      cy.get("[data-test=shop-categories-item-list]")
        .first()
        .click({ force: true });
      cy.get("[data-test=shop-item-list]").first().click({ force: true });
      cy.get("[data-test=add-item-to-card]").click({ force: true });
      cy.get("[data-test=update-cart]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=goToCart]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=open-wallet-modal]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=pay-with-wallet]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=pay-shop]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=goToShop]", { force: true }).should("exist");
    });
  });
});
