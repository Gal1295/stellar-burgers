import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  // Получаем пользователя из глобального состояния
  const user = useSelector(selectUser);

  // В случае отсутствия пользователя, показываем дефолтный интерфейс
  return <AppHeaderUI userName={user ? user.name : 'Пользователь'} />;
};
