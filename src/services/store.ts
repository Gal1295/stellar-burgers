import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import constructorReducer from './slices/burgerConstructorSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';

// Объединяем все редьюсеры в один
export const rootReducer = combineReducers({
  burgerconstructor: constructorReducer, // Управление состоянием конструктора бургеров
  feed: feedReducer, // Управление данными о заказах
  ingredients: ingredientsReducer, // Управление данными об ингредиентах
  user: userReducer // Управление состоянием пользователя
});

// Создаем хранилище Redux с корневым редьюсером
const store = configureStore({
  reducer: rootReducer, // Передаем объединенный редьюсер
  devTools: process.env.NODE_ENV !== 'production' // Включаем инструменты разработчика только в режиме разработки
});

// Определяем тип для состояния приложения
export type RootState = ReturnType<typeof rootReducer>;

// Определяем тип для диспетчера Redux
export type AppDispatch = typeof store.dispatch;

// Создаем пользовательский хук для использования диспетчера
export const useDispatch: () => AppDispatch = () => dispatchHook();

// Создаем пользовательский хук для выбора данных из состояния
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Экспортируем хранилище по умолчанию
export default store;
