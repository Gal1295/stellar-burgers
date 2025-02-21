import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { selectUser } from '../../services/slices/userSlice';
import { updateUser } from '../../services/slices/userThunks';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../../components/ui/preloader';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);

  // Если данные пользователя отсутствуют, показываем индикатор загрузки
  if (!userData) {
    return <Preloader />;
  }

  // Состояние для хранения значений формы
  const [formValue, setFormValue] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  });

  // Обновляем состояние формы при изменении данных пользователя
  useEffect(() => {
    if (userData) {
      setFormValue({
        name: userData?.name || '',
        email: userData?.email || '',
        password: ''
      });
    }
  }, [userData]);

  // Проверяем, были ли внесены изменения в форму
  const isFormChanged =
    formValue.name !== userData?.name ||
    formValue.email !== userData?.email ||
    !!formValue.password;

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    // Если форма была изменена, отправляем запрос на обновление данных
    if (isFormChanged) {
      try {
        await dispatch(updateUser(formValue)).unwrap();
      } catch (error) {
        console.error('Ошибка при обновлении данных', error);
      }
    }
  };

  // Обработчик отмены изменений в форме
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    // Сбрасываем значения формы к исходным данным пользователя
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  };

  // Обработчик изменений в полях формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Возвращаем UI-компонент с передачей всех необходимых пропсов
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
