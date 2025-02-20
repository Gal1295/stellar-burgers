import { createSlice } from '@reduxjs/toolkit';
import { TUser, TOrder } from '@utils-types';
import {
  loginUser,
  getUserData,
  registerUser,
  updateUser,
  userLogout,
  forgotPassword,
  resetPassword,
  fetchOrders,
  checkUserAuth
} from './userThunks';
import { RootState } from '../store';

// Определяем структуру состояния для управления данными пользователя
interface UserState {
  items: any;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  loginUserRequest: boolean;
  ordersLoading: boolean;
  ordersError: string | null;
}

// Начальное состояние редюсера
const initialState: UserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  orders: [],
  isLoading: false,
  error: null,
  loginUserRequest: false,
  ordersLoading: false,
  ordersError: null,
  items: null
};

// Создаем слайс для управления состоянием пользователя
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка проверки аутентификации
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthenticated = false;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при проверке аутентификации';
      })

      // Обработка авторизации пользователя
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload?.message || 'Ошибка при входе';
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })

      // Обработка получения данных пользователя
      .addCase(getUserData.pending, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = true;
        state.isLoading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.isLoading = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthChecked = true;
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка получения данных';
      })

      // Обработка регистрации пользователя
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginUserRequest = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Обработка обновления данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.isAuthenticated = true;
        state.loginUserRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.loginUserRequest = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginUserRequest = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })

      // Обработка выхода пользователя
      .addCase(userLogout.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated = false;
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.user = null;
        state.orders = [];
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка выхода';
      })

      // Обработка сброса пароля
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка сброса пароля';
      })

      // Обработка установки нового пароля
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка установки нового пароля';
      })

      // Обработка получения заказов
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
        state.ordersError = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error.message || 'Ошибка получения заказов';
      });
  }
});

// Экспортируем редьюсер и экшены
export const { authChecked } = userSlice.actions;

// Экспортируем селекторы для доступа к состоянию
export const selectUser = (state: RootState) => state.user.user;
export const selectUserOrders = (state: RootState) => state.user.orders;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectOrdersLoading = (state: RootState) =>
  state.user.ordersLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectOrdersError = (state: RootState) => state.user.ordersError;
export const selectIsAuth = (state: RootState) => state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export default userSlice.reducer;
