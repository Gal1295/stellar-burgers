import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectIsLoading,
  selectOrders,
  selectTotalOrders,
  selectTotalOrdersToday
} from '../../services/slices/feedSlice';

// Функция для фильтрации заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status) // Отбираем заказы с указанным статусом
    .map((item) => item.number) // Получаем только номера заказов
    .slice(0, 20); // Ограничиваем количество до 20

export const FeedInfo: FC = () => {
  // Извлекаем данные о заказах и состоянии загрузки из Redux
  const orders: TOrder[] = useSelector(selectOrders) ?? []; // Защита от undefined
  const isLoading = useSelector(selectIsLoading);
  const total = useSelector(selectTotalOrders); // Общее количество заказов
  const totalToday = useSelector(selectTotalOrdersToday); // Количество заказов за сегодня

  // Мемоизация данных для готовых и ожидающих заказов
  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  // Если данные еще загружаются, отображаем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Возвращаем компонент UI, передавая все необходимые данные
  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }} // Передаем объект с общей информацией о заказах
    />
  );
};
