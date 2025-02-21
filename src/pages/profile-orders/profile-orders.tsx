import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { selectUserOrders } from '../../services/slices/userSlice';
import { fetchOrders } from '../../services/slices/userThunks';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch(); // Инициализируем диспетчер Redux

  // Получаем список заказов пользователя из глобального состояния
  const orders: TOrder[] = useSelector(selectUserOrders) || [];

  // Загружаем данные о заказах при монтировании компонента
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Возвращаем UI-компонент с передачей списка заказов
  return <ProfileOrdersUI orders={orders} />;
};
