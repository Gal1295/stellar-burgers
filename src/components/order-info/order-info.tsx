import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/feedSlice';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { RootState } from '../../services/store';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const currentNumber = Number(useParams().number);

  // Извлекаем данные о заказах из глобального состояния Redux
  const orders = useSelector((state: RootState) => state.feed.orders);
  const ordersHistory = useSelector((state: RootState) => state.user.orders);
  const modalOrder = useSelector(
    (state: RootState) => state.feed.selectedModalOrder
  );

  // Получаем список доступных ингредиентов
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Находим заказ по его номеру, проверяя все возможные источники данных
  const orderData = useMemo(() => {
    // Проверяем наличие заказа в общем списке заказов и истории заказов
    const foundInOrders = [...orders, ...ordersHistory].find(
      (order) => order.number === currentNumber
    );
    if (foundInOrders) return foundInOrders;

    // Если заказ не найден, проверяем данные модального окна
    if (modalOrder && modalOrder.number === currentNumber) {
      return modalOrder;
    }

    // Если заказ отсутствует во всех источниках, возвращаем null
    return null;
  }, [orders, ordersHistory, modalOrder, currentNumber]);

  // Загружаем данные о заказе, если они еще не загружены
  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(currentNumber));
    }
  }, [dispatch, orderData, currentNumber]);

  // Вычисляем информацию о заказе для отображения
  const orderInfo = useMemo(() => {
    // Если данные о заказе или ингредиентах отсутствуют, прекращаем выполнение
    if (!orderData || !ingredients.length) return;

    // Преобразуем дату создания заказа в объект Date
    const date = new Date(orderData.createdAt);

    // Определяем тип для хранения информации об ингредиентах с их количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Формируем объект с информацией об ингредиентах и их количестве
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );

    // Рассчитываем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем объект с обработанной информацией о заказе
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Если информация о заказе отсутствует, показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Возвращаем компонент для отображения информации о заказе
  return <OrderInfoUI orderInfo={orderInfo} />;
};
