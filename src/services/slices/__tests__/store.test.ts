import { rootReducer } from '../../store';

describe('rootReducer tests', () => {
  it('returns the correct initial state when called with undefined state and an unknown action', () => {
    // Вызываем rootReducer с undefined состоянием и незнакомым экшеном
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что возвращаемое состояние соответствует начальному состоянию хранилища
    expect(initialState).toEqual(
      expect.objectContaining({
        burgerconstructor: expect.any(Object), // Начальное состояние конструктора бургеров
        feed: expect.any(Object), // Начальное состояние заказов
        ingredients: expect.any(Object), // Начальное состояние ингредиентов
        user: expect.any(Object) // Начальное состояние пользователя
      })
    );

    // Проверка структуры каждого слайса
    expect(initialState.burgerconstructor).toEqual(
      expect.objectContaining({
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null,
        loading: true,
        error: null
      })
    );

    expect(initialState.feed).toEqual(
      expect.objectContaining({
        orders: [],
        selectedModalOrder: null,
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      })
    );

    expect(initialState.ingredients).toEqual(
      expect.objectContaining({
        items: [],
        loading: false,
        error: null
      })
    );

    expect(initialState.user).toEqual(
      expect.objectContaining({
        user: null, // Пользователь не авторизован
        isAuthChecked: false, // Проверка аутентификации не выполнена
        isAuthenticated: false, // Флаг аутентификации
        isLoading: false, // Загрузка данных пользователя
        error: null, // Ошибки при загрузке данных пользователя
        loginUserRequest: false, // Флаг запроса входа в систему
        orders: [], // Список заказов пользователя
        ordersError: null, // Ошибки при загрузке заказов пользователя
        ordersLoading: false // Загрузка заказов пользователя
      })
    );
  });
});
