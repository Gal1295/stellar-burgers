import React from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

// Определяем тип для пропсов компонента ProtectedRoute
type ProtectedRouteProps = {
  isNotLoginRoute?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isNotLoginRoute,
  children
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);

  // Функция для рендеринга загрузчика, если аутентификация еще не завершена
  const renderPreloader = () => <Preloader />;

  // Функция для перенаправления на страницу входа
  const redirectToLogin = () => (
    <Navigate replace to='/login' state={{ from: location }} />
  );

  // Функция для перенаправления на главную страницу, если пользователь уже авторизован
  const redirectToHome = () => {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  };

  // Основная логика отображения компонента
  const renderContent = () => {
    if (!isAuthChecked) {
      return renderPreloader(); // Показываем индикатор загрузки
    }

    if (!isNotLoginRoute && !user) {
      return redirectToLogin(); // Если не авторизован, перенаправляем на страницу входа
    }

    if (isNotLoginRoute && user) {
      return redirectToHome(); // Если авторизован, перенаправляем на главную
    }

    return <>{children}</>; // Если все проверки пройдены, отображаем дочерние компоненты
  };

  return renderContent(); // Возвращаем контент в зависимости от состояния
};
