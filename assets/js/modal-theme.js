// Обработка изменения заголовка модального окна через data-theme и открытие модального окна
(function() {
  'use strict';

  function initModalTheme() {
    const modalButtons = document.querySelectorAll('[data-open-modal="modal-form"]');
    const modalForm = document.querySelector('[data-modal="modal-form"]');
    const modalTitle = modalForm ? modalForm.querySelector('.modal__title') : null;
    const modalOverlay = modalForm ? modalForm.querySelector('.modal__overlay') : null;
    const closeButtons = modalForm ? modalForm.querySelectorAll('[data-close-modal]') : null;
    const pageWrapper = document.querySelector('.page-wrapper');

    if (!modalForm || !modalTitle) {
      return;
    }

    // Функция для открытия модального окна
    function openModal() {
      modalForm.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      // Убеждаемся, что модальное окно видно
      modalForm.style.visibility = 'visible';
      modalForm.style.opacity = '1';
      modalForm.style.pointerEvents = 'auto';
    }

    // Функция для закрытия модального окна
    function closeModal() {
      modalForm.classList.remove('is-active');
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      
      // Сбрасываем inline стили
      modalForm.style.visibility = '';
      modalForm.style.opacity = '';
      modalForm.style.pointerEvents = '';
    }

    // Обработчики для кнопок открытия
    modalButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Изменяем заголовок
        const theme = button.getAttribute('data-theme');
        if (theme && modalTitle) {
          modalTitle.textContent = theme;
        }

        // Открываем модальное окно
        openModal();
      });
    });

    // Обработчики для закрытия модального окна
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    if (closeButtons) {
      closeButtons.forEach(function(button) {
        button.addEventListener('click', closeModal);
      });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalForm.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  // Инициализация после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModalTheme);
  } else {
    initModalTheme();
  }
})();
