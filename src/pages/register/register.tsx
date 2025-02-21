import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { TRegisterData } from '@api';
import { Preloader } from '../../components/ui/preloader';
import { useNavigate } from 'react-router-dom';
import { selectError, selectIsLoading } from '../../services/slices/userSlice';
import { registerUser } from '../../services/slices/userThunks';
import { useDispatch, useSelector } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading); // Проверяем состояние загрузки
  const error = useSelector(selectError); // Получаем сообщение об ошибке из хранилища

  // Обновляем текст ошибки при изменении состояния ошибки в Redux
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  // Обработчик отправки формы регистрации
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    // Проверяем, что все поля заполнены
    if (!userName || !email || !password) {
      setErrorMessage('Необходимо заполнить все обязательные поля.');
      return;
    }

    // Формируем данные для регистрации
    const newUserData: TRegisterData = {
      name: userName,
      email: email,
      password: password
    };

    try {
      // Отправляем запрос на регистрацию пользователя
      await dispatch(registerUser(newUserData));

      navigate('/login');
    } catch (err) {
      // Логируем ошибку и устанавливаем сообщение об ошибке
      console.error('Произошла ошибка при регистрации:', err);
      setErrorMessage('Не удалось зарегистрироваться. Попробуйте снова.');
    }

    // Очищаем значения полей формы после отправки
    setUserName('');
    setEmail('');
    setPassword('');
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return <Preloader />;
  }

  // Возвращаем UI-компонент с передачей всех необходимых пропсов
  return (
    <RegisterUI
      errorText={errorMessage}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
