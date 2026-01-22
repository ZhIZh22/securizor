// Отправка формы в Telegram через Bot API
// ИНСТРУКЦИЯ: 
// 1. Скопируйте этот файл и назовите telegram-form.js
// 2. Замените YOUR_BOT_TOKEN_HERE и YOUR_CHAT_ID_HERE на свои значения
// 3. См. инструкцию в файле TELEGRAM_SETUP.md
(function() {
  'use strict';

  // ВАЖНО: Замените эти значения на свои!
  const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Токен вашего бота от @BotFather
  const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE'; // ID чата/канала куда отправлять

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

      // Формируем сообщение
      const message = `
🔔 <b>Новая заявка с сайта</b>

📋 <b>Тема:</b> ${theme}

👤 <b>Имя:</b> ${name}

📱 <b>Платформа для связи:</b> ${selectedPlatform}

📞 <b>Контакт:</b> ${contact}

💬 <b>Вопрос:</b>
${comment}
      `.trim();

      // Отправляем в Telegram
      sendToTelegram(message);
    });

    function sendToTelegram(message) {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      const data = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      };

      // Показываем индикатор загрузки (опционально)
      const submitButton = form.querySelector('.modal-form__submit');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Отправка...';
      submitButton.disabled = true;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
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
          // Ошибка от Telegram API
          console.error('Telegram API Error:', data);
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
