import { TFeedsResponse, TOrderResponse } from '../../../utils/burger-api';
import { feedSlice, fetchFeedsData, fetchOrderByNumber } from '../feedSlice';

const { reducer: feedReducer } = feedSlice;

// Моковые данные для заказов
const mockOrdersResponse: TFeedsResponse = {
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
    },
    {
      _id: 'order2',
      number: 102,
      status: 'pending',
      name: 'Test Order 2',
      createdAt: '2025-03-01T00:10:00.000Z',
      updatedAt: '2025-03-01T00:15:00.000Z',
      ingredients: ['ingredient3']
    }
  ],
  total: 150,
  totalToday: 30
};

const mockOrderResponse: TOrderResponse = {
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

describe('feedSlice tests', () => {
  const initialState = feedSlice.getInitialState();

  it('returns the initial state', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchFeedsData', () => {
    it('handles pending state', () => {
      const state = feedReducer(
        { ...initialState, error: 'Test error' },
        fetchFeedsData.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles fulfilled state', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchFeedsData.fulfilled(mockOrdersResponse, '')
      );

      expect(state.orders).toHaveLength(2); // Проверяем количество заказов
      expect(state.orders[0]).toEqual(
        expect.objectContaining({
          _id: mockOrdersResponse.orders[0]._id,
          number: mockOrdersResponse.orders[0].number,
          status: mockOrdersResponse.orders[0].status,
          name: mockOrdersResponse.orders[0].name,
          createdAt: mockOrdersResponse.orders[0].createdAt,
          updatedAt: mockOrdersResponse.orders[0].updatedAt,
          ingredients: mockOrdersResponse.orders[0].ingredients
        })
      );
      expect(state.total).toBe(mockOrdersResponse.total);
      expect(state.totalToday).toBe(mockOrdersResponse.totalToday);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка получения заказов';
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchFeedsData.rejected(new Error(errorMessage), '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('handles pending state', () => {
      const state = feedReducer(
        { ...initialState, error: 'Test error' },
        fetchOrderByNumber.pending('', 101)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles fulfilled state', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchOrderByNumber.fulfilled(mockOrderResponse, '101', 101)
      );

      expect(state.selectedModalOrder).toEqual(
        expect.objectContaining({
          _id: mockOrderResponse.orders[0]._id,
          number: mockOrderResponse.orders[0].number,
          status: mockOrderResponse.orders[0].status,
          name: mockOrderResponse.orders[0].name,
          createdAt: mockOrderResponse.orders[0].createdAt,
          updatedAt: mockOrderResponse.orders[0].updatedAt,
          ingredients: mockOrderResponse.orders[0].ingredients
        })
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка получения заказа';
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchOrderByNumber.rejected(new Error(errorMessage), '101', 101, {})
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clearselectedModalOrder', () => {
    it('clears the selected modal order', () => {
      const state = feedReducer(
        { ...initialState, selectedModalOrder: mockOrdersResponse.orders[0] },
        feedSlice.actions.clearselectedModalOrder()
      );

      expect(state.selectedModalOrder).toBeNull();
    });
  });
});
