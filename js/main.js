import './utils.js';
// import './pictures.js';
import './form.js';

import {getData} from './api.js';
import {renderPictures} from './pictures.js';

const showLoadError = () => {
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('load-error');
  errorMessage.textContent = 'Не удалось загрузить фотографии. Обновите страницу.';
  document.body.append(errorMessage);
};

getData()
  .then((photos) => {
    renderPictures(photos);
  })
  .catch(() => {
    showLoadError();
  });
