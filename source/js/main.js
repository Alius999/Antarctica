import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';
// import leafletjs from './js/leaflet';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();
  });
});

const burgerIconOpen = document.querySelector('.header__burger-icon--open');
const burgerIconClose = document.querySelector('.header__burger-icon--close');
const headerList = document.querySelector('.header__list');
const headerLogo = document.querySelector('.header__logo');

burgerIconClose.addEventListener('click', () => {
  burgerIconClose.style.display = 'none';
  burgerIconOpen.style.display = 'block'
  headerList.style.display = 'none';
  headerLogo.style.fill = '#F9FBFD';
  headerLogo.style.marginLeft = 0;
})

burgerIconOpen.addEventListener('click', () => {
  burgerIconClose.style.display = 'block';
  burgerIconOpen.style.display = 'none'
  headerList.style.display = 'block';
  headerLogo.style.fill = '#011C40';
  headerLogo.style.marginLeft = 48;
})

// Map



// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
