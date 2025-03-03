import burgerConstructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  initialState
} from '../burgerConstructorSlice';

const reducer = burgerConstructorSlice;

// Моковые данные для ингредиентов
const spicySauce = {
  _id: 'sauce-1',
  type: 'sauce',
  name: 'Spicy BBQ Sauce',
  price: 60,
  image: 'spicy_sauce_image_url',
  image_large: 'spicy_sauce_image_large_url',
  image_mobile: 'spicy_sauce_image_mobile_url',
  id: 'sauce-1', // Используем _id как id
  proteins: 3,
  fat: 2,
  carbohydrates: 6,
  calories: 50
};

const crispyLettuce = {
  _id: 'veg-1',
  type: 'vegetable',
  name: 'Crispy Lettuce Leaves',
  price: 35,
  image: 'crispy_lettuce_image_url',
  image_large: 'crispy_lettuce_image_large_url',
  image_mobile: 'crispy_lettuce_image_mobile_url',
  id: 'veg-1', // Используем _id как id
  proteins: 1,
  fat: 0,
  carbohydrates: 5,
  calories: 20
};

const sesameBun = {
  _id: 'bun-1',
  type: 'bun',
  name: 'Sesame Seed Bun',
  price: 110,
  image: 'sesame_bun_image_url',
  image_large: 'sesame_bun_image_large_url',
  image_mobile: 'sesame_bun_image_mobile_url',
  id: 'bun-1', // Используем _id как id
  proteins: 12,
  fat: 6,
  carbohydrates: 35,
  calories: 270
};

describe('burgerConstructorSlice tests', () => {
  it('adds a new ingredient to the constructor list', () => {
    const state = reducer(initialState, addIngredient(spicySauce));

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(spicySauce);
  });

  it('replaces the existing bun with a new one', () => {
    const state = reducer(initialState, addIngredient(sesameBun));

    expect(state.constructorItems.bun).toEqual(sesameBun);
    expect(state.constructorItems.ingredients).toHaveLength(0); // После добавления булки список ингредиентов должен быть пустым
  });

  it('removes an ingredient from the constructor by its ID', () => {
    let state = reducer(initialState, addIngredient(crispyLettuce));
    state = reducer(state, addIngredient(spicySauce));

    state = reducer(state, removeIngredient(crispyLettuce.id));

    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual(spicySauce); // Проверяем оставшийся ингредиент
  });

  it('reorders ingredients in the constructor list', () => {
    let state = reducer(initialState, addIngredient(crispyLettuce));
    state = reducer(state, addIngredient(spicySauce));

    state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));

    expect(state.constructorItems.ingredients[0]).toEqual(spicySauce); // Первый элемент должен быть соусом
    expect(state.constructorItems.ingredients[1]).toEqual(crispyLettuce); // Второй элемент должен быть салатом
  });

  it('prevents reordering if indices are out of bounds', () => {
    let state = reducer(initialState, addIngredient(crispyLettuce));

    state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));

    expect(state.constructorItems.ingredients[0]).toEqual(crispyLettuce);
  });
});
