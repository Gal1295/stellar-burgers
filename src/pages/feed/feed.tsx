import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeedsData,
  selectIsLoading,
  selectOrders
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Получаем состояние загрузки
  const isLoading = useSelector(selectIsLoading);

  // Получаем список заказов
  const orders: TOrder[] = useSelector(selectOrders);

  // Выполняем запрос на получение данных о заказах при монтировании компонента
  useEffect(() => {
    dispatch(fetchFeedsData());
  }, [dispatch]);

  // Если данные о заказах еще загружаются, показываем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Функция для обновления списка заказов
  const handleGetOrders = () => {
    dispatch(fetchFeedsData());
  };

  // Отображаем компонент FeedUI с передачей данных и функции обновления
  return <FeedUI orders={orders} handleGetFeeds={handleGetOrders} />;
};
