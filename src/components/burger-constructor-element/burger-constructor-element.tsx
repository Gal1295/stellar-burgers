import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Вспомогательная функция для перемещения
    const handleShift = (delta: number) => () => {
      const newIndex = index + delta;
      if (newIndex >= 0 && newIndex < totalItems) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: newIndex }));
      }
    };

    // Функции для перемещения
    const handleShiftUp = handleShift(-1);
    const handleShiftDown = handleShift(1);

    // Функция для удаления ингредиента
    const handleRemove = () => {
      dispatch(removeIngredient(ingredient.id)); // Удаляем ингредиент по его ID
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleShiftUp}
        handleMoveDown={handleShiftDown}
        handleClose={handleRemove}
      />
    );
  }
);
