import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';
import { RootState } from '../store';

// Определяем структуру состояния для ингредиентов
interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние редюсера
export const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

// Асинхронная thunk-функция для получения списка ингредиентов
export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients', // Тип действия
  async () => {
    try {
      const response = await getIngredientsApi(); // Выполняем запрос к API
      return response;
    } catch (error) {
      console.error('Ошибка при загрузке ингредиентов:', error);
      throw error;
    }
  }
);

// Создаем слайс для управления состоянием ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {}, // Пустые редюсеры
  extraReducers: (builder) => {
    builder
      // Обработка состояния загрузки
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Обработка успешного завершения загрузки
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload; // Сохраняем полученные данные
        }
      )
      // Обработка ошибки загрузки
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Ошибка загрузки ингредиентов';
      });
  }
});

// Экспортируем селекторы для доступа к состоянию

// Селектор для получения списка ингредиентов
export const selectIngredients = (state: RootState) => state.ingredients.items;

// Селектор для проверки состояния загрузки
export const selectLoading = (state: RootState) => state.ingredients.loading;

// Селектор для получения сообщения об ошибке
export const selectError = (state: RootState) => state.ingredients.error;

// Экспортируем редюсер
export default ingredientsSlice.reducer;
