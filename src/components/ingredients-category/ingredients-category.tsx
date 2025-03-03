import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/slices/burgerConstructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, ...rest }, ref) => {
  // Извлекаем данные конструктора из Redux
  const { bun, ingredients: constructorIngredients } =
    useSelector(getConstructorItems);

  // Формируем объект с данными конструктора
  const constructorItems = {
    bun: bun,
    ingredients: constructorIngredients || [] // Убеждаемся, что массив ингредиентов всегда существует
  };

  // Вычисляем количество каждого ингредиента в конструкторе
  const ingredientsCounters = useMemo<{ [key: string]: number }>(() => {
    const { bun, ingredients } = constructorItems;
    const counters: { [key: string]: number } = {};

    // Подсчитываем количество каждого ингредиента
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Если есть булка, добавляем её в счетчик (всегда две штуки)
    if (bun) counters[bun._id] = 2;

    return counters;
  }, [constructorItems]);

  // Возвращаем компонент для отображения категории ингредиентов
  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      {...rest}
    />
  );
});
