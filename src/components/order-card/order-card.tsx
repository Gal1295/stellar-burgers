import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  // Получаем список ингредиентов из глобального состояния Redux
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Вычисляем информацию о заказе для отображения
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return;

    // Формируем массив ингредиентов, связанных с заказом
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Вычисляем общую стоимость заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Определяем ингредиенты для отображения и количество скрытых элементов
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Преобразуем дату создания заказа в объект Date
    const date = new Date(order.createdAt);

    // Возвращаем объект с обработанной информацией о заказе
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  // Если информация о заказе отсутствует, ничего не рендерим
  if (!orderInfo) return null;

  // Возвращаем компонент для отображения информации о заказе
  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
