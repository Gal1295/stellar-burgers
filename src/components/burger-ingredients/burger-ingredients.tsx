import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import {
  selectIngredients,
  selectLoading
} from '../../services/slices/ingredientsSlice';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  // Получаем данные ингредиентов и состояние загрузки из Redux
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectLoading);

  // Если данные еще загружаются, отображаем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Разделяем ингредиенты на категории: булки, начинки и соусы
  // Используем useMemo для оптимизации фильтрации данных
  const buns = useMemo(
    () => ingredients.filter((item: { type: string }) => item.type === 'bun'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((item: { type: string }) => item.type === 'main'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((item: { type: string }) => item.type === 'sauce'),
    [ingredients]
  );

  // Состояние для текущей активной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Создаем ссылки на заголовки секций для управления видимостью
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Отслеживаем видимость каждой секции с помощью useInView
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Обновляем активную вкладку в зависимости от видимости секций
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Функция для обработки клика по вкладке
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode); // Устанавливаем активную вкладку
    // Прокручиваем к соответствующей секции с плавной анимацией
    if (tab === 'bun') {
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'main') {
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'sauce') {
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Возвращаем компонент UI, передавая все необходимые данные
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
