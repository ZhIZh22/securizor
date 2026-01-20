// Scroll Animations - Intersection Observer for fade-in on scroll
(function() {
  'use strict';

  // Проверяем поддержку Intersection Observer
  if (!('IntersectionObserver' in window)) {
    // Fallback для старых браузеров - просто показываем элементы
    document.querySelectorAll('[data-animate-on-scroll]').forEach(function(el) {
      el.classList.add('animate-visible');
    });
    return;
  }

  // Создаем Observer с настройками
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -100px 0px', // запускать анимацию когда элемент еще на 100px выше viewport
    threshold: 0.1 // запускать когда 10% элемента видно
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        // Отключаем наблюдение после появления, чтобы не повторять анимацию
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Находим все элементы с атрибутом data-animate-on-scroll и начинаем наблюдать
  const animateElements = document.querySelectorAll('[data-animate-on-scroll]');
  
  animateElements.forEach(function(element) {
    observer.observe(element);
  });

})();
