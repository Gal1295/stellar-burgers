import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals') as HTMLDivElement | null;

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  // Проверяем, существует ли контейнер для модального окна
  if (!modalRoot) return null;

  useEffect(() => {
    // Функция для обработки нажатия клавиши Escape
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Блокируем прокрутку страницы при открытии модального окна
    document.body.style.overflow = 'hidden';

    // Добавляем слушатель для закрытия по клавише Escape
    document.addEventListener('keydown', handleEsc);

    // Очистка эффекта при размонтировании компонента
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
    };
  }, [onClose]);

  // Создаем портал для рендеринга модального окна
  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
});
