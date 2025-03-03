///<reference types="cypress"/>

// Тест создания заказа
describe('Order test', function () {
  // Селекторы элементов для тестирования (в стиле camelCase с префиксом selector)
  const bunElementSelector = '[data-cy=ingredients_bun]'; // Селектор для выбора булок из списка ингредиентов
  const mainIngredientSelector = '[data-cy=ingredients_main]'; // Селектор для выбора основных ингредиентов
  const sauceIngredientSelector = '[data-cy=ingredients_sauce]'; // Селектор для выбора соусов
  const orderButtonSelector = '[data-cy=order_button]'; // Селектор кнопки "Оформить заказ"
  const modalWindowSelector = '[data-cy=modal-window]'; // Селектор модального окна с деталями заказа
  const modalCloseBtnSelector = '[data-cy=modal-close-btn]'; // Селектор кнопки закрытия модального окна
  const burgerConstructorSelector = '[data-cy=burger_constructor]'; // Селектор конструктора бургера
  const ingredientListConstructorSelector =
    '[data-cy=ingredient_list_constructor]'; // Селектор списка ингредиентов в конструкторе

  // Настройка перед каждым тестом
  beforeEach(function () {
    // Мокируем запрос на получение списка ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Мокируем запрос для проверки авторизованного пользователя
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });

    // Мокируем POST-запрос на создание заказа
    cy.intercept('POST', '/api/orders', (req) => {
      req.reply({ fixture: 'order.json' }); // Используем фикстуру для имитации ответа сервера
    }).as('postOrder');

    // Устанавливаем токены для успешной авторизации
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken') // Сохраняем refresh-токен в localStorage
    );
    cy.setCookie('accessToken', 'test-accessToken'); // Устанавливаем access-токен в куки

    // Переходим на главную страницу приложения
    cy.visit('/');

    // Ждем завершения мокированного запроса для получения ингредиентов
    cy.wait('@getIngredients');
  });

  // Очистка после каждого теста
  afterEach(function () {
    // Очищаем cookies и localStorage, чтобы не влиять на последующие тесты
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // Тест успешного создания заказа
  it('Create success order test', function () {
    // Добавляем булку, основной ингредиент и соус в конструктор
    cy.get(bunElementSelector).contains('Добавить').click(); // Добавляем булку
    cy.get(mainIngredientSelector).contains('Добавить').click(); // Добавляем основной ингредиент
    cy.get(sauceIngredientSelector).contains('Добавить').click(); // Добавляем соус

    // Кликаем на кнопку "Оформить заказ"
    cy.get(orderButtonSelector)
      .contains('Оформить заказ')
      .should('exist') // Проверяем, что кнопка существует
      .click(); // Нажимаем кнопку

    // Ждем завершения POST-запроса на создание заказа
    cy.wait('@postOrder').then((interception) => {
      // Проверяем, что сервер вернул статус 200 (успешный ответ)
      expect(interception.response?.statusCode).to.eq(200);

      // Проверяем, что номер заказа соответствует ожидаемому значению из фикстуры
      expect(String(interception.response?.body.order.number)).to.eq('2345666');
    });

    // Закрываем модальное окно кликом на кнопку закрытия
    cy.get(modalCloseBtnSelector).click(); // Кликаем по кнопке закрытия
    cy.get(modalWindowSelector).should('not.exist'); // Проверяем, что модальное окно исчезло

    // Проверяем, что конструктор очищен после создания заказа
    cy.get(burgerConstructorSelector).should('not.contain', 'Краторная булка'); // Булка удалена
    cy.get(ingredientListConstructorSelector).should(
      'not.contain',
      'Соус с шипами'
    ); // Соус удален
    cy.get(ingredientListConstructorSelector).should(
      'not.contain',
      'Биокотлета'
    ); // Основной ингредиент удален
  });
});
