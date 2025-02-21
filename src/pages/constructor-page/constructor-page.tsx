import { FC } from 'react';
import styles from './constructor-page.module.css';

import { BurgerConstructor, BurgerIngredients } from '../../components';
import { Preloader } from '../../components/ui';
import { selectLoading } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

export const ConstructorPage: FC = () => {
  // Получаем флаг загрузки ингредиентов
  const isIngredientsLoading = useSelector(selectLoading);

  return (
    <>
      {/* Проверяем, загружаются ли ингредиенты */}
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        // Когда загрузка завершена, отображаем основное содержимое страницы
        <main className={styles.containerMain}>
          {/* Заголовок страницы конструктора */}
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>

          {/* Основное содержимое страницы */}
          <div className={`${styles.main} pl-5 pr-5`}>
            {/* Список ингредиентов для бургера */}
            <BurgerIngredients />
            {/* Конструктор для сборки бургера */}
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
