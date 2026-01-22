// Отправка формы в Telegram через FastAPI бэкенд
// 
// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
// 1. Запустите FastAPI бэкенд (см. backend/README.md)
// 2. Убедитесь, что бэкенд работает на http://localhost:8001
// 3. Для продакшена измените API_URL на адрес вашего сервера
//
(function() {
  'use strict';

  // URL бэкенда (измените для продакшена)
  const API_URL = 'http://localhost:8001/api/send-form';

  function initTelegramForm() {
    const form = document.querySelector('.modal-form');
    const modalForm = document.querySelector('[data-modal="modal-form"]');
    const modalSuccess = document.querySelector('[data-modal="modal-success"]');
    const modalError = document.querySelector('[data-modal="modal-error"]');
    const modalControls = document.querySelectorAll('.modal__control');
    const typeInput = document.querySelector('input[name="type"]');

    if (!form) {
      console.error('Форма не найдена');
      return;
    }

    // Отслеживание выбранной платформы
    let selectedPlatform = 'WhatsApp'; // По умолчанию

    modalControls.forEach(function(control) {
      control.addEventListener('click', function() {
        const platformText = control.getAttribute('data-type-back');
        selectedPlatform = platformText || 'Не указано';
        
        // Обновляем скрытое поле type
        if (typeInput) {
          typeInput.value = selectedPlatform;
        }
      });
    });

    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Получаем данные формы
      const formData = new FormData(form);
      const name = formData.get('name') || 'Не указано';
      const contact = formData.get('contact') || 'Не указано';
      const comment = formData.get('comment') || 'Не указано';
      const theme = formData.get('theme') || 'Не указано';

      // Отправляем данные на бэкенд
      sendToBackend({
        name: name,
        contact: contact,
        comment: comment,
        theme: theme,
        platform: selectedPlatform
      });
    });

    function sendToBackend(formData) {

      // Показываем индикатор загрузки (опционально)
      const submitButton = form.querySelector('.modal-form__submit');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Отправка...';
      submitButton.disabled = true;

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Успешная отправка
          closeModal(modalForm);
          openModal(modalSuccess);
          
          // Очищаем форму
          form.reset();
          
          // Автоматически закрываем модальное окно успеха через 3 секунды
          setTimeout(function() {
            closeModal(modalSuccess);
          }, 3000);
        } else {
          // Ошибка от бэкенда
          console.error('Backend Error:', data);
          closeModal(modalForm);
          openModal(modalError);
        }
      })
      .catch(error => {
        // Ошибка сети или другая ошибка
        console.error('Error:', error);
        closeModal(modalForm);
        openModal(modalError);
      })
      .finally(() => {
        // Возвращаем кнопку в исходное состояние
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      });
    }

    // Вспомогательные функции для модальных окон
    function openModal(modal) {
      if (!modal) return;
      modal.classList.add('is-active');
      modal.style.visibility = 'visible';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('is-active');
      modal.style.visibility = '';
      modal.style.opacity = '';
      modal.style.pointerEvents = '';
    }

    // Обработчики закрытия модальных окон успеха/ошибки
    [modalSuccess, modalError].forEach(function(modal) {
      if (!modal) return;

      const overlay = modal.querySelector('.modal__overlay');
      const closeBtn = modal.querySelector('[data-close-modal]');

      if (overlay) {
        overlay.addEventListener('click', function() {
          closeModal(modal);
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          closeModal(modal);
        });
      }
    });
  }

  // Инициализация после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramForm);
  } else {
    initTelegramForm();
  }
})();
