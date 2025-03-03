import { userSlice } from '../userSlice';
import {
  checkUserAuth,
  loginUser,
  registerUser,
  updateUser,
  userLogout,
  forgotPassword,
  resetPassword,
  fetchOrders,
  getUserData
} from '../userThunks';
import { TUser, TOrder } from '../../../utils/types';

// Импортируем reducer напрямую из слайса
const reducer = userSlice.reducer;

// Моковые данные для пользователя и заказов
const mockUserResponse: { success: boolean; user: TUser } = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Updated User'
  }
};

const mockOrdersResponse: { success: boolean; orders: TOrder[] } = {
  success: true,
  orders: [
    {
      _id: 'order1',
      number: 101,
      status: 'done',
      name: 'Test Order 1',
      createdAt: '2025-03-01T00:00:00.000Z',
      updatedAt: '2025-03-01T00:05:00.000Z',
      ingredients: ['ingredient1', 'ingredient2']
    }
  ]
};

describe('userSlice tests', () => {
  const initialState = userSlice.getInitialState();

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('authChecked', () => {
    it('sets isAuthChecked to true', () => {
      const nextState = reducer(initialState, userSlice.actions.authChecked());
      expect(nextState.isAuthChecked).toBe(true);
    });
  });

  describe('checkUserAuth', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        checkUserAuth.pending('', undefined)
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, isLoading: true },
        checkUserAuth.fulfilled(undefined, '', undefined)
      );
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.isLoading).toBe(false);
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка при проверке аутентификации';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        checkUserAuth.rejected(new Error(errorMessage), '')
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('loginUser', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        loginUser.pending('', {
          email: 'test@mail.com',
          password: 'newPassword'
        })
      );
      expect(nextState.loginUserRequest).toBe(true);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, loginUserRequest: true },
        loginUser.fulfilled(mockUserResponse.user, '', {
          email: 'test@mail.com',
          password: 'newPassword'
        })
      );
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user).toEqual(
        expect.objectContaining({
          email: mockUserResponse.user.email,
          name: mockUserResponse.user.name
        })
      );
      expect(nextState.loginUserRequest).toBe(false);
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка входа';
      const nextState = reducer(
        { ...initialState, loginUserRequest: true },
        loginUser.rejected(new Error(errorMessage), '', {
          email: 'test@mail.com',
          password: 'newPassword'
        })
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('getUserData', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        getUserData.pending('', undefined)
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, isLoading: true },
        getUserData.fulfilled(
          { success: true, user: mockUserResponse.user },
          ''
        )
      );
      expect(nextState.user).toEqual(
        expect.objectContaining({
          email: mockUserResponse.user.email,
          name: mockUserResponse.user.name
        })
      );
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.isLoading).toBe(false);
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка получения данных';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        getUserData.rejected(new Error(errorMessage), '')
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('registerUser', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        registerUser.pending('', {
          email: 'test@mail.com',
          password: 'newPassword',
          name: 'testToken'
        })
      );
      expect(nextState.isLoading).toBe(true);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, isLoading: true },
        registerUser.fulfilled(mockUserResponse.user, '', {
          email: 'test@mail.com',
          password: 'newPassword',
          name: 'testToken'
        })
      );
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user).toEqual(
        expect.objectContaining({
          email: mockUserResponse.user.email,
          name: mockUserResponse.user.name
        })
      );
      expect(nextState.isLoading).toBe(false);
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка регистрации';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(new Error(errorMessage), '', {
          email: 'test@mail.com',
          password: 'newPassword',
          name: 'testToken'
        })
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('updateUser', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        updateUser.pending('', mockUserResponse.user)
      );
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const updatedUserData = { name: 'Updated User' };
      const nextState = reducer(
        { ...initialState, user: mockUserResponse.user, isLoading: true },
        updateUser.fulfilled(
          {
            email: 'test@example.com',
            name: 'Updated User'
          },
          '',
          {}
        )
      );
      expect(nextState.user).toEqual(
        expect.objectContaining({
          email: mockUserResponse.user.email,
          name: updatedUserData.name
        })
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull;
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка обновления данных';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        updateUser.rejected(new Error(errorMessage), '', {})
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('userLogout', () => {
    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, isAuthenticated: true, user: mockUserResponse.user },
        userLogout.fulfilled(undefined, '')
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.user).toBeNull;
      expect(nextState.orders).toHaveLength(0);
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка выхода';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        userLogout.rejected(new Error(errorMessage), '')
      );
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('forgotPassword', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        forgotPassword.pending('', { email: 'test@mail.com' })
      );
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, isLoading: true },
        forgotPassword.fulfilled({ success: true }, '', {
          email: 'test@mail.com'
        })
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull;
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка сброса пароля';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        forgotPassword.rejected(new Error(errorMessage), '', {
          email: 'test@mail.com'
        })
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('resetPassword', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        resetPassword.pending('', {
          password: 'newPassword',
          token: 'testToken'
        })
      );
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, isLoading: true },
        resetPassword.fulfilled({ success: true }, '', {
          password: 'newPassword',
          token: 'testToken'
        })
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull;
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка установки нового пароля';
      const nextState = reducer(
        { ...initialState, isLoading: true },
        resetPassword.rejected(new Error(errorMessage), '', {
          password: 'newPassword',
          token: 'testToken'
        })
      );
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(errorMessage);
    });
  });

  describe('fetchOrders', () => {
    it('handles pending state', () => {
      const nextState = reducer(
        initialState,
        fetchOrders.pending('', undefined)
      );
      expect(nextState.ordersLoading).toBe(true);
      expect(nextState.ordersError).toBeNull;
    });

    it('handles fulfilled state', () => {
      const nextState = reducer(
        { ...initialState, ordersLoading: true },
        fetchOrders.fulfilled(mockOrdersResponse.orders, '')
      );
      expect(nextState.orders).toHaveLength(1);
      expect(nextState.orders[0]).toEqual(
        expect.objectContaining({
          _id: mockOrdersResponse.orders[0]._id,
          number: mockOrdersResponse.orders[0].number,
          status: mockOrdersResponse.orders[0].status,
          name: mockOrdersResponse.orders[0].name
        })
      );
      expect(nextState.ordersLoading).toBe(false);
      expect(nextState.ordersError).toBeNull;
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка получения заказов';
      const nextState = reducer(
        { ...initialState, ordersLoading: true },
        fetchOrders.rejected(new Error(errorMessage), '')
      );
      expect(nextState.ordersLoading).toBe(false);
      expect(nextState.ordersError).toBe(errorMessage);
    });
  });
});
