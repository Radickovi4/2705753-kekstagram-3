
import './utils.js';
import './form.js';

import {getData} from './api.js';
import {initFilters} from './filters.js';

const showLoadError = () => {
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('load-error');
  errorMessage.textContent = 'Не удалось загрузить фотографии. Обновите страницу.';
  document.body.append(errorMessage);
};

getData()
  .then(initFilters)
  .catch(showLoadError);
