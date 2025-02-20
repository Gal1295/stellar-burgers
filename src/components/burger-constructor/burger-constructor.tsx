import { FC, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  resetConstructor,
  getConstructorItems,
  getOrderRequestStatus,
  getOrderModalInfo,
  sendOrder
} from '../../services/slices/burgerConstructorSlice';
import {
  selectIsAuth,
  selectIsAuthChecked
} from '../../services/slices/userSlice';
import { checkUserAuth } from '../../services/slices/userThunks';
import { useSelector, useDispatch } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequestStatus);
  const orderModalData = useSelector(getOrderModalInfo);
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Проверка авторизации пользователя при загрузке компонента
  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth()); // Инициируем проверку авторизации
    }
  }, [dispatch, isAuthChecked]);

  // Обработка клика по кнопке оформления заказа
  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login', { state: { from: window.location.pathname } }); // Перенаправляем на страницу входа
    }
    if (!constructorItems.bun || orderRequest) return; // Если булочка отсутствует или заказ уже в процессе, ничего не делаем

    // Формируем массив с данными для заказа
    const order = [
      constructorItems.bun._id, // Добавляем булочку (один раз)
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ), // Добавляем все ингредиенты
      constructorItems.bun._id // Добавляем булочку в конце
    ].filter(Boolean); // Удаляем пустые значения из массива

    dispatch(sendOrder(order)); // Отправляем данные заказа в Redux
  };

  // Закрытие модального окна с информацией о заказе
  const closeOrderModal = () => {
    dispatch(resetConstructor()); // Очищаем состояние конструктора
    navigate('/'); // Возвращаемся на главную страницу
  };

  // Вычисление общей стоимости заказа с оптимизацией через useMemo
  const price = useMemo(() => {
    if (!constructorItems.bun || !constructorItems.ingredients) {
      return 0; // Если нет булочки или ингредиентов, возвращаем 0
    }
    return (
      constructorItems.bun.price * 2 + // Цена булочки (умножаем на 2)
      constructorItems.ingredients.reduce(
        (total: number, ingredient: TConstructorIngredient) =>
          total + ingredient.price,
        0 // Складываем цены всех ингредиентов
      )
    );
  }, [constructorItems]); // Пересчитываем стоимость только при изменении данных конструктора

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
