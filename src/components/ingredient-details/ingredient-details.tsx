import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  fetchIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';
import { selectIsLoading, selectError } from '../../services/slices/userSlice';
import { AppDispatch } from '../../services/store';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем список ингредиентов из Redux, гарантируя, что это массив
  const ingredients = useSelector(selectIngredients) || [];
  const isLoading = useSelector(selectIsLoading);
  const errorMessage = useSelector(selectError);

  // Извлекаем ID ингредиента из параметров URL
  const { id } = useParams<{ id?: string }>();
  if (!id) return <div>Некорректный адрес страницы</div>; // Обработка отсутствия ID

  // Загружаем ингредиенты, если они еще не были загружены
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Отображаем прелоадер во время загрузки данных
  if (isLoading) return <Preloader />;
  if (errorMessage) return <div>{errorMessage}</div>;

  // Если ингредиенты не загружены, показываем прелоадер
  if (ingredients.length === 0) return <Preloader />;

  // Находим ингредиент по его уникальному идентификатору
  const ingredientData = ingredients.find(
    (item: { _id: string }) => item._id === id
  );
  if (!ingredientData) return <div>Данные об ингредиенте отсутствуют</div>;

  // Возвращаем компонент для отображения деталей ингредиента
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
