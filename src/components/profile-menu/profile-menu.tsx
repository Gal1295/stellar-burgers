import { FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { userLogout } from '../../services/slices/userThunks';

export const ProfileMenu: FC = () => {
  // Получаем текущий путь
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Обработчик выхода
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(userLogout()).unwrap();

      // Перенаправляем пользователя на страницу входа
      navigate('/login', { replace: true }); // Чтобы нельзя было вернуться назад
    } catch (error) {
      // Логируем ошибку, если она возникла
      console.warn('Ошибка выхода:', error);
    }
  }, [dispatch, navigate]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

export default ProfileMenu;
