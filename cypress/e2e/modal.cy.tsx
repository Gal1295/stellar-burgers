/// <reference types="cypress" />

describe('Тест модального окна', function () {
  const modalWindowSelector = '[data-cy=modal-window]';
  const modalCloseBtnSelector = '[data-cy=modal-close-btn]';
  const modalOverlaySelector = '[data-cy=modal-overlay]';
  const ingredientsBunSelector = '[data-cy=ingredients_bun]';

  beforeEach(function () {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Модальное окно ингредиента открывается при клике на элемент', function () {
    cy.get(ingredientsBunSelector).contains('Краторная булка').as('bunElement');
    cy.get('@bunElement').click();
    cy.get(modalWindowSelector).contains('Краторная булка').should('exist');
  });

  it('Модальное окно ингредиента закрывается через кнопку закрытия', function () {
    cy.get(ingredientsBunSelector).contains('Краторная булка').as('bunElement');
    cy.get('@bunElement').click();
    cy.get(modalCloseBtnSelector).as('closeButton');
    cy.get('@closeButton').click();
    cy.get(modalWindowSelector).should('not.exist');
  });

  it('Модальное окно ингредиента закрывается через клик по оверлею', function () {
    cy.get(ingredientsBunSelector).contains('Краторная булка').as('bunElement');
    cy.get('@bunElement').click();
    cy.get(modalOverlaySelector).click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get(modalWindowSelector).should('not.exist');
  });
});
