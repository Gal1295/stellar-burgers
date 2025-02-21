import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getOrdersApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { authChecked } from './userSlice';

// Авторизация пользователя
export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: { message: string } }
>('user/loginUser', async (data) => {
  const response = await loginUserApi(data);

  // Сохраняем токены
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response.user;
});

// Получение данных пользователя
export const getUserData = createAsyncThunk('user/getUserData', getUserApi);

// Регистрация пользователя
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

// Выход пользователя
export const userLogout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Сброс пароля
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  forgotPasswordApi
);

// Установка нового пароля
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  (data: { password: string; token: string }) => resetPasswordApi(data)
);

// Получение заказов пользователя (история заказов)
export const fetchOrders = createAsyncThunk('user/fetchOrders', getOrdersApi);

// Проверка аутентификации пользователя (проверка наличия токена)
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');
    if (token) {
      await dispatch(getUserData());
    }
    dispatch(authChecked());
  }
);
