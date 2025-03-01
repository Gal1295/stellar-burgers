import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../services/store';
import { v4 as uuidv4 } from 'uuid';

// Определение типов для состояния конструктора
interface ConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null; // Булочка для бургера (может быть пустой)
    ingredients: TConstructorIngredient[]; // Список дополнительных ингредиентов
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null | undefined;
}

// Начальное состояние конструктора
const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  loading: true,
  error: null
};

// Асинхронный экшен для отправки заказа
export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data); // Отправляем данные на сервер
    return response;
  }
);

// Создаем слайс для управления состоянием конструктора
const burgerConstructorSlice = createSlice({
  name: 'burgerconstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        // Если это булочка, заменяем текущую булочку
        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
        } else {
          // Иначе добавляем ингредиент в список
          state.constructorItems.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4() // Генерируем уникальный ID с использованием uuidv4
        }
      })
    },
    // Удаление ингредиента из конструктора
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload // Удаляем по уникальному ID
        );
    },
    // Перемещение ингредиента внутри конструктора
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;

      // Проверяем корректность индексов
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.constructorItems.ingredients.length ||
        toIndex >= state.constructorItems.ingredients.length
      ) {
        return;
      }

      // Перемещаем ингредиент
      const [movedItem] = state.constructorItems.ingredients.splice(
        fromIndex,
        1
      );
      state.constructorItems.ingredients.splice(toIndex, 0, movedItem);
    },
    // Сброс состояния конструктора
    resetConstructor(state) {
      state.constructorItems = initialState.constructorItems; // Возвращаем к начальному состоянию
      state.orderRequest = false;
      state.orderModalData = null;
      state.loading = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true; // Устанавливаем флаг отправки заказа
        state.loading = true; // Включаем состояние загрузки
        state.error = null; // Очищаем ошибку
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false; // Сбрасываем флаг отправки заказа
        state.loading = false; // Выключаем состояние загрузки
        state.error =
          action.error.message || 'Произошла ошибка при оформлении заказа'; // Сохраняем сообщение об ошибке
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false; // Сбрасываем флаг отправки заказа
        state.orderModalData = action.payload.order; // Сохраняем данные о заказе
        state.constructorItems.bun = null; // Очищаем булочку
        state.constructorItems.ingredients = []; // Очищаем ингредиенты
        state.loading = false; // Выключаем состояние загрузки
        state.error = null; // Очищаем ошибку
      });
  }
});

// Экспортируем действия
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = burgerConstructorSlice.actions;

// Селекторы для доступа к состоянию
export const getConstructorItems = (state: RootState) =>
  state.burgerconstructor.constructorItems;

export const getOrderRequestStatus = (state: RootState) =>
  state.burgerconstructor.orderRequest;

export const getOrderModalInfo = (state: RootState) =>
  state.burgerconstructor.orderModalData;

export const getLoadingStatus = (state: RootState) =>
  state.burgerconstructor.loading;

export const getError = (state: RootState) => state.burgerconstructor.error;

export default burgerConstructorSlice.reducer;
