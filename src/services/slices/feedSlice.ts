import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  TOrderResponse
} from '../../utils/burger-api';
import { RootState } from '../store';

// Определяем структуру состояния для заказов
export interface FeedState {
  orders: TOrder[];
  selectedModalOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние редюсера
export const initialState: FeedState = {
  orders: [],
  selectedModalOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Асинхронные Thunk-функции для работы с API
// Получение списка всех заказов
export const fetchFeedsData = createAsyncThunk(
  'feeds/data',
  async () => await getFeedsApi() // Выполняем запрос к API для получения всех заказов
);

// Получение информации о заказе по его номеру
export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => {
    const response: TOrderResponse = await getOrderByNumberApi(number);
    return response;
  }
);

// Создаем слайс для управления состоянием заказов
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // Очистка выбранного заказа в модальном окне
    clearselectedModalOrder(state) {
      state.selectedModalOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка загрузки всех заказов
      .addCase(fetchFeedsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedsData.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeedsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения заказов';
      })
      // Обработка загрузки заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.isLoading = false;
          state.selectedModalOrder = action.payload.orders[0]; // Сохраняем выбранный заказ
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения заказа';
      });
  }
});

// Экспортируем действия
export const { clearselectedModalOrder } = feedSlice.actions;

// Экспортируем селекторы для доступа к состоянию

// Селектор для получения списка заказов
export const selectOrders = (state: RootState) => state.feed.orders;

// Селектор для получения выбранного заказа
export const selectselectedModalOrder = (state: RootState) =>
  state.feed.selectedModalOrder;

// Селектор для получения общего количества заказов
export const selectTotalOrders = (state: RootState) => state.feed.total;

// Селектор для получения количества заказов за сегодня
export const selectTotalOrdersToday = (state: RootState) =>
  state.feed.totalToday;

// Селектор для проверки состояния загрузки
export const selectIsLoading = (state: RootState) => state.feed.isLoading;

// Селектор для получения сообщения об ошибке
export const selectError = (state: RootState) => state.feed.error;

export default feedSlice.reducer;
