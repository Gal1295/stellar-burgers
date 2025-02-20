import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { TLoginData } from '@api';
import { selectError, selectIsAuth } from '../../services/slices/userSlice';
import { loginUser } from '../../services/slices/userThunks';
import { useDispatch, useSelector } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState(''); // Для отображения ошибок
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector(selectIsAuth); // Проверка авторизации пользователя
  const authError = useSelector(selectError); // Ошибка авторизации из хранилища

  // Определяем маршрут, куда нужно перенаправить после входа
  const from = location.state?.from || '/'; // Если маршрут не указан, используем главную страницу

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Данные для авторизации
    const userLoginData: TLoginData = {
      email: email,
      password: password
    };

    // Проверяем, что все поля заполнены
    if (!email || !password) {
      setErrorText('Необходимо заполнить все обязательные поля');
      return;
    }

    try {
      // Отправляем запрос на авторизацию
      await dispatch(loginUser(userLoginData)).unwrap();

      // Если пользователь успешно авторизован, выполняем редирект
      if (isAuth) {
        navigate(from);
      }

      // Очищаем текст ошибки после успешного входа
      setErrorText('');
    } catch (error) {
      // В случае неудачной авторизации
      setErrorText(authError || 'Неправильный логин или пароль');
    }
  };

  // Возвращаем UI-компонент с передачей всех необходимых пропсов
  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
