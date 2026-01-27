// Custom Scrollbar
(function() {
  'use strict';

  class CustomScrollbar {
    constructor(contentElement) {
      this.content = contentElement;
      this.container = contentElement.parentElement;
      
      this.scrollbar = null;
      this.track = null;
      this.thumb = null;
      
      this.isDragging = false;
      this.startY = 0;
      this.startScrollTop = 0;
      
      this.init();
    }

    init() {
      // Создаем элементы скроллбара
      this.createScrollbar();
      
      // Обновляем скроллбар
      this.update();
      
      // Добавляем обработчики событий
      this.addEventListeners();
    }

    createScrollbar() {
      // Создаем контейнер скроллбара
      this.scrollbar = document.createElement('div');
      this.scrollbar.className = 'custom-scrollbar';
      
      // Создаем трек
      this.track = document.createElement('div');
      this.track.className = 'custom-scrollbar__track';
      
      // Создаем ползунок
      this.thumb = document.createElement('div');
      this.thumb.className = 'custom-scrollbar__thumb';
      
      // Собираем структуру
      this.track.appendChild(this.thumb);
      this.scrollbar.appendChild(this.track);
      this.container.appendChild(this.scrollbar);
    }

    update() {
      const contentHeight = this.content.scrollHeight;
      const containerHeight = this.content.clientHeight;
      const trackHeight = this.track.clientHeight;
      
      // Проверяем, нужен ли скроллбар
      if (contentHeight <= containerHeight) {
        this.scrollbar.style.display = 'none';
        return;
      } else {
        this.scrollbar.style.display = 'block';
      }
      
      // Вычисляем высоту ползунка
      const thumbHeight = Math.max(
        (containerHeight / contentHeight) * trackHeight,
        30 // Минимальная высота ползунка
      );
      this.thumb.style.height = thumbHeight + 'px';
      
      // Обновляем позицию ползунка
      this.updateThumbPosition();
    }

    updateThumbPosition() {
      const contentHeight = this.content.scrollHeight;
      const containerHeight = this.content.clientHeight;
      const trackHeight = this.track.clientHeight;
      const thumbHeight = this.thumb.clientHeight;
      const scrollTop = this.content.scrollTop;
      
      const maxScroll = contentHeight - containerHeight;
      const maxThumbTop = trackHeight - thumbHeight;
      
      const thumbTop = (scrollTop / maxScroll) * maxThumbTop;
      this.thumb.style.top = thumbTop + 'px';
    }

    addEventListeners() {
      // Прокрутка контента
      this.content.addEventListener('scroll', () => {
        this.updateThumbPosition();
      });
      
      // Изменение размера окна
      window.addEventListener('resize', () => {
        this.update();
      });
      
      // Наблюдение за изменениями контента
      const observer = new MutationObserver(() => {
        this.update();
      });
      observer.observe(this.content, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      // Клик по треку
      this.track.addEventListener('click', (e) => {
        if (e.target === this.thumb) return;
        
        const trackRect = this.track.getBoundingClientRect();
        const clickY = e.clientY - trackRect.top;
        const thumbHeight = this.thumb.clientHeight;
        const trackHeight = this.track.clientHeight;
        
        const newThumbTop = Math.max(0, Math.min(clickY - thumbHeight / 2, trackHeight - thumbHeight));
        const scrollPercent = newThumbTop / (trackHeight - thumbHeight);
        
        const contentHeight = this.content.scrollHeight;
        const containerHeight = this.content.clientHeight;
        const maxScroll = contentHeight - containerHeight;
        
        this.content.scrollTop = scrollPercent * maxScroll;
      });
      
      // Перетаскивание ползунка
      this.thumb.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.startY = e.clientY;
        this.startScrollTop = this.content.scrollTop;
        this.thumb.classList.add('is-dragging');
        
        document.body.style.userSelect = 'none';
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        
        const deltaY = e.clientY - this.startY;
        const trackHeight = this.track.clientHeight;
        const thumbHeight = this.thumb.clientHeight;
        const contentHeight = this.content.scrollHeight;
        const containerHeight = this.content.clientHeight;
        const maxScroll = contentHeight - containerHeight;
        
        const scrollDelta = (deltaY / (trackHeight - thumbHeight)) * maxScroll;
        this.content.scrollTop = this.startScrollTop + scrollDelta;
      });
      
      document.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.thumb.classList.remove('is-dragging');
          document.body.style.userSelect = '';
        }
      });
      
      // Прокрутка колесиком
      this.content.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.content.scrollTop += e.deltaY;
      });
    }
  }

  // Класс для горизонтального скроллбара
  class CustomScrollbarHorizontal {
    constructor(contentElement, containerElement) {
      this.content = contentElement;
      this.container = containerElement;
      
      this.scrollbar = null;
      this.track = null;
      this.thumb = null;
      
      this.isDragging = false;
      this.startX = 0;
      this.startScrollLeft = 0;
      
      this.init();
    }

    init() {
      // Создаем элементы скроллбара
      this.createScrollbar();
      
      // Обновляем скроллбар
      this.update();
      
      // Добавляем обработчики событий
      this.addEventListeners();
    }

    createScrollbar() {
      // Создаем контейнер скроллбара
      this.scrollbar = document.createElement('div');
      this.scrollbar.className = 'custom-scrollbar-horizontal';
      
      // Создаем трек
      this.track = document.createElement('div');
      this.track.className = 'custom-scrollbar-horizontal__track';
      
      // Создаем ползунок
      this.thumb = document.createElement('div');
      this.thumb.className = 'custom-scrollbar-horizontal__thumb';
      
      // Собираем структуру
      this.track.appendChild(this.thumb);
      this.scrollbar.appendChild(this.track);
      this.container.appendChild(this.scrollbar);
    }

    update() {
      const contentWidth = this.content.scrollWidth;
      const containerWidth = this.content.clientWidth;
      const trackWidth = this.track.clientWidth;
      
      // Проверяем, нужен ли скроллбар
      if (contentWidth <= containerWidth) {
        this.scrollbar.style.display = 'none';
        return;
      } else {
        this.scrollbar.style.display = 'block';
      }
      
      // Вычисляем ширину ползунка
      const thumbWidth = Math.max(
        (containerWidth / contentWidth) * trackWidth,
        50 // Минимальная ширина ползунка
      );
      this.thumb.style.width = thumbWidth + 'px';
      
      // Обновляем позицию ползунка
      this.updateThumbPosition();
    }

    updateThumbPosition() {
      const contentWidth = this.content.scrollWidth;
      const containerWidth = this.content.clientWidth;
      const trackWidth = this.track.clientWidth;
      const thumbWidth = this.thumb.clientWidth;
      const scrollLeft = this.content.scrollLeft;
      
      const maxScroll = contentWidth - containerWidth;
      const maxThumbLeft = trackWidth - thumbWidth;
      
      const thumbLeft = (scrollLeft / maxScroll) * maxThumbLeft;
      this.thumb.style.left = thumbLeft + 'px';
    }

    addEventListeners() {
      // Прокрутка контента
      this.content.addEventListener('scroll', () => {
        this.updateThumbPosition();
      });
      
      // Изменение размера окна
      window.addEventListener('resize', () => {
        this.update();
      });
      
      // Наблюдение за изменениями контента
      const observer = new MutationObserver(() => {
        this.update();
      });
      observer.observe(this.content, {
        childList: true,
        subtree: true
      });
      
      // Клик по треку
      this.track.addEventListener('click', (e) => {
        if (e.target === this.thumb) return;
        
        const trackRect = this.track.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const thumbWidth = this.thumb.clientWidth;
        const trackWidth = this.track.clientWidth;
        
        const newThumbLeft = Math.max(0, Math.min(clickX - thumbWidth / 2, trackWidth - thumbWidth));
        const scrollPercent = newThumbLeft / (trackWidth - thumbWidth);
        
        const contentWidth = this.content.scrollWidth;
        const containerWidth = this.content.clientWidth;
        const maxScroll = contentWidth - containerWidth;
        
        this.content.scrollLeft = scrollPercent * maxScroll;
      });
      
      // Перетаскивание ползунка
      this.thumb.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX;
        this.startScrollLeft = this.content.scrollLeft;
        this.thumb.classList.add('is-dragging');
        
        document.body.style.userSelect = 'none';
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.startX;
        const trackWidth = this.track.clientWidth;
        const thumbWidth = this.thumb.clientWidth;
        const contentWidth = this.content.scrollWidth;
        const containerWidth = this.content.clientWidth;
        const maxScroll = contentWidth - containerWidth;
        
        const scrollDelta = (deltaX / (trackWidth - thumbWidth)) * maxScroll;
        this.content.scrollLeft = this.startScrollLeft + scrollDelta;
      });
      
      document.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.isDragging = false;
          this.thumb.classList.remove('is-dragging');
          document.body.style.userSelect = '';
        }
      });
      
      // Прокрутка колесиком (горизонтальная)
      this.content.addEventListener('wheel', (e) => {
        // Не предотвращаем по умолчанию, чтобы работала прокрутка
        if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          this.content.scrollLeft += e.deltaX || e.deltaY;
        }
      }, { passive: false });
    }
  }

  // Инициализация после загрузки DOM
  document.addEventListener('DOMContentLoaded', () => {
    // Вертикальный скроллбар для features
    const featuresContent = document.querySelector('.features__content');
    if (featuresContent) {
      new CustomScrollbar(featuresContent);
    }
    
    // Горизонтальные скроллбары для services
    const servicesElements = document.querySelectorAll('.services__element');
    const scrollbarInstances = [];
    
    servicesElements.forEach(element => {
      const wrapper = element.closest('.services__wrapper');
      if (wrapper) {
        const scrollbarInstance = new CustomScrollbarHorizontal(element, wrapper);
        scrollbarInstances.push({ element, scrollbar: scrollbarInstance.scrollbar });
      }
    });
    
    // Функция для обновления видимости скроллбаров
    function updateScrollbarVisibility() {
      scrollbarInstances.forEach(({ element, scrollbar }) => {
        if (element.classList.contains('is-active')) {
          scrollbar.style.display = 'block';
        } else {
          scrollbar.style.display = 'none';
        }
      });
    }
    
    // Начальное обновление видимости
    updateScrollbarVisibility();
    
    // Наблюдаем за изменениями классов на элементах
    servicesElements.forEach(element => {
      const observer = new MutationObserver(updateScrollbarVisibility);
      observer.observe(element, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
    
    // Вертикальный скроллбар для таблицы отчета
    const reportTableWrapper = document.querySelector('.report__table-wrapper');
    if (reportTableWrapper) {
      // Создаем кастомный скроллбар
      const reportScrollbar = new CustomScrollbar(reportTableWrapper);
      // Добавляем специальный класс для стилизации
      if (reportScrollbar.scrollbar) {
        reportScrollbar.scrollbar.classList.add('report-table-scrollbar');
      }
    }
    
    // Вертикальный скроллбар для правого блока с отчетом
    const reportRightContent = document.querySelector('.report__block-right-content');
    if (reportRightContent) {
      // Создаем кастомный скроллбар
      const reportRightScrollbar = new CustomScrollbar(reportRightContent);
      // Добавляем специальный класс для стилизации
      if (reportRightScrollbar.scrollbar) {
        reportRightScrollbar.scrollbar.classList.add('report-right-scrollbar');
        
        // Устанавливаем отступ справа такой же, как у левого блока (6px)
        reportRightScrollbar.scrollbar.style.right = '6px';
        
        // Устанавливаем отступ сверху 10px и высоту на всю оставшуюся высоту блока
        const updateScrollbarTop = () => {
          const parentBlock = reportRightContent.closest('.report__block--right');
          if (parentBlock && reportRightScrollbar.scrollbar) {
            reportRightScrollbar.scrollbar.style.top = '10px';
            reportRightScrollbar.scrollbar.style.height = 'calc(100% - 10px)';
          }
        };
        
        // Вызываем при загрузке и изменении размера
        updateScrollbarTop();
        window.addEventListener('resize', updateScrollbarTop);
        
        // Наблюдаем за изменениями размера блока
        const resizeObserver = new ResizeObserver(() => {
          updateScrollbarTop();
        });
        if (reportRightContent.closest('.report__block--right')) {
          resizeObserver.observe(reportRightContent.closest('.report__block--right'));
        }
      }
    }
  });
})();
