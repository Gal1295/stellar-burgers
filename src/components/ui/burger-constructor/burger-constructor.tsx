import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import { getConstructorItems } from '../../../services/slices/burgerConstructorSlice';
import { useSelector } from '../../../services/store';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../../services/slices/userSlice'; // Импортируем селектор для проверки авторизации

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => {
  const { bun, ingredients } = useSelector(getConstructorItems);
  const user = useSelector(selectUser); // Получаем информацию о пользователе
  const navigate = useNavigate();

  // Проверка авторизации перед оформлением заказа
  const handleOrderClick = () => {
    if (!user) {
      // Если пользователь не авторизован, перенаправляем его на страницу логина
      navigate('/login');
      return;
    }
    onOrderClick(); // Если авторизован, выполняем функцию оформления заказа
  };

  const renderBunElement = (type: 'top' | 'bottom') =>
    bun ? (
      <div
        className={`${styles.element} ${type === 'top' ? 'mb-4 mr-4' : 'mt-4 mr-4'}`}
      >
        <ConstructorElement
          type={type}
          isLocked
          text={`${bun.name} (${type === 'top' ? 'верх' : 'низ'})`}
          price={bun.price}
          thumbnail={bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${type === 'top' ? styles.noBunsTop : styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    );

  const renderIngredients = () => {
    if (ingredients.length > 0) {
      return ingredients.map((item: TConstructorIngredient, index: number) => (
        <BurgerConstructorElement
          ingredient={item}
          index={index}
          totalItems={ingredients.length}
          key={item.id}
        />
      ));
    } else {
      return (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите начинку
        </div>
      );
    }
  };

  return (
    <section className={styles.burger_constructor}>
      {renderBunElement('top')}
      <ul className={styles.elements}>{renderIngredients()}</ul>
      {renderBunElement('bottom')}
      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={handleOrderClick} // Используем новую функцию для проверки авторизации
        />
      </div>

      {orderRequest && (
        <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
          <Preloader />
        </Modal>
      )}

      {orderModalData && (
        <Modal
          onClose={closeOrderModal}
          title={orderRequest ? 'Оформляем заказ...' : ''}
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
