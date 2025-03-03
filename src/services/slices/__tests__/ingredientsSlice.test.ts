import { ingredientsSlice, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const { reducer: ingredientsReducer } = ingredientsSlice;

// Моковые данные для ингредиентов
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'mock-image.jpg',
    image_mobile: 'mock-mobile.jpg',
    image_large: 'mock-large.jpg'
  },
  {
    _id: '2',
    name: 'Sauce',
    type: 'sauce',
    proteins: 5,
    fat: 3,
    carbohydrates: 10,
    calories: 50,
    price: 20,
    image: 'mock-sauce.jpg',
    image_mobile: 'mock-sauce-mobile.jpg',
    image_large: 'mock-sauce-large.jpg'
  }
];

describe('ingredientsSlice tests', () => {
  const initialState = ingredientsSlice.getInitialState();

  it('returns the initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('handles pending state', () => {
      const state = ingredientsReducer(
        { ...initialState, error: 'Test error' },
        fetchIngredients.pending('', undefined)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles fulfilled state', () => {
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        fetchIngredients.fulfilled(mockIngredients, '')
      );

      expect(state.items).toHaveLength(2); // Проверяем количество ингредиентов
      expect(state.items[0]).toEqual(
        expect.objectContaining({
          _id: mockIngredients[0]._id,
          name: mockIngredients[0].name,
          type: mockIngredients[0].type,
          price: mockIngredients[0].price,
          image: mockIngredients[0].image
        })
      );
      expect(state.items[1]).toEqual(
        expect.objectContaining({
          _id: mockIngredients[1]._id,
          name: mockIngredients[1].name,
          type: mockIngredients[1].type,
          price: mockIngredients[1].price,
          image: mockIngredients[1].image
        })
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('handles rejected state', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const state = ingredientsReducer(
        { ...initialState, loading: true },
        fetchIngredients.rejected(new Error(errorMessage), '')
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
