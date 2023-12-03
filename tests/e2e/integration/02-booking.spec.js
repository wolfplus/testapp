/// <reference types="cypress" />

context("Before Each", () => {
  beforeEach(() => {
    cy.viewport("iphone-5");
    cy.visit("/");
  });

  describe("Book a sport", () => {
    it(".should() - book a slot and pay it with its wallet.", () => {
      cy.get("[data-test=bookIn]").click({ force: true });
      cy.get("[data-test=time-choice-component]", { force: true }).should(
        "exist"
      );
      cy.get(".block-date-select > :nth-child(1)").click({ force: true });
      cy.get("[data-test=open-filter-modal]").click({ force: true });

      cy.get("[data-test=apply-filter-button]").click({ force: true });
      cy.wait(2000);
      cy.get("[data-test=openBooking]").eq(0).click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=addFriends]").first().click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=add-friend-button]").first().click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=closeDone]").first().click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=go-to-confirm-booking]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=present-wallet-modal]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=pay-with-wallet]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=confirm-booking]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=touch-to-continue]", { force: true }).should("exist");
    });

    it(".should() - book a slot and pay it with credit card.", () => {
      cy.get("[data-test=bookIn]").click({ force: true });
      cy.get("[data-test=time-choice-component]", { force: true }).should(
        "exist"
      );
      cy.get(".block-date-select > :nth-child(3)").click({ force: true });
      cy.get("[data-test=open-filter-modal]").click({ force: true });

      cy.get("[data-test=apply-filter-button]").click({ force: true });
      cy.wait(2000);
      cy.get("[data-test=openBooking]").eq(1).click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=addFriends]").first().click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=add-friend-button]").first().click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=closeDone]").first().click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=go-to-confirm-booking]").click({ force: true });
      cy.wait(3000);
      cy.getWithinIframe('[name="cardnumber"]')
        .should("exist")
        .type("4242424242424242", {
          force: true,
        });
      cy.getWithinIframe('[name="exp-date"]').type("1232", {
        force: true,
      });
      cy.getWithinIframe('[name="cvc"]').type("987", {
        force: true,
      });
      cy.wait(1000)
      cy.get("[data-test=confirm-booking]").click({ force: true });
      cy.wait(1000);
      cy.get("[data-test=touch-to-continue]", { force: true })
        .should("exist");
    });
  });
});
