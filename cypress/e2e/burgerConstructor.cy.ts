/// <reference types="cypress" />

describe('Constructor page test', function () {
  // Селекторы для элементов страницы конструктора
  const bunElementSelector = '[data-cy=ingredients_bun]'; // Селектор для выбора булок из списка ингредиентов
  const topBunSelector = '[data-cy=top_bun_constructor]'; // Селектор верхней части булки в конструкторе
  const bottomBunSelector = '[data-cy=bottom_bun_constructor]'; // Селектор нижней части булки в конструкторе
  const ingredientListSelector = '[data-cy=ingredient_list_constructor]'; // Селектор списка ингредиентов в конструкторе
  const mainIngredientSelector = '[data-cy=ingredients_main]'; // Селектор основных ингредиентов (например, мясо)
  const sauceIngredientSelector = '[data-cy=ingredients_sauce]'; // Селектор соусов

  beforeEach(function () {
    // Мокаем запрос на получение данных об ингредиентах
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Переходим на главную страницу приложения
    cy.visit('/');

    // Ждем завершения мокированного запроса к API для получения ингредиентов
    cy.wait('@getIngredients');
  });

  // Тест проверяет добавление булки в конструктор при клике на кнопку "Добавить"
  it('Test of adding bun', function () {
    // Проверяем, что в конструкторе еще нет верхней и нижней частей булки
    cy.get(topBunSelector).should('not.exist'); // Верхняя часть булки отсутствует
    cy.get(bottomBunSelector).should('not.exist'); // Нижняя часть булки отсутствует

    // Кликаем по кнопке "Добавить" у элемента с булкой
    cy.get(bunElementSelector).contains('Добавить').click();

    // Проверяем, что после клика булка появилась в конструкторе
    cy.get(topBunSelector).should('exist'); // Верхняя часть булки теперь существует
    cy.get(bottomBunSelector).should('exist'); // Нижняя часть булки теперь существует
  });

  // Тест проверяет добавление основных ингредиентов и соусов в конструктор
  it('Test of adding main ingredients and sauces', function () {
    // Проверяем, что выбранные ингредиенты ("Биокотлета" и "Соус с шипами") еще не добавлены в конструктор
    cy.get(ingredientListSelector).contains('Биокотлета').should('not.exist'); // "Биокотлета" отсутствует
    cy.get(ingredientListSelector).contains('Филе').should('not.exist'); // "Филе" отсутствует

    // Кликаем по кнопке "Добавить" у основного ингредиента (например, "Биокотлета")
    cy.get(mainIngredientSelector).contains('Добавить').click();

    // Проверяем, что основной ингредиент ("Биокотлета") успешно добавлен в конструктор
    cy.get(ingredientListSelector).contains('Биокотлета').should('exist');

    // Кликаем по кнопке "Добавить" у соуса (например, "Соус с шипами")
    cy.get(sauceIngredientSelector).contains('Добавить').click();

    // Проверяем, что соус ("Соус с шипами") успешно добавлен в конструктор
    cy.get(ingredientListSelector).contains('Соус с шипами').should('exist');
  });
});
