import './form.js';

import {getData} from './api.js';
import {initFilters} from './filters.js';

const DATA_ERROR_TEMPLATE = document.querySelector('#data-error');
const DATA_ERROR_TIMEOUT = 5000;

const showLoadError = () => {
  const errorMessage = DATA_ERROR_TEMPLATE.content.firstElementChild.cloneNode(true);
  document.body.append(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, DATA_ERROR_TIMEOUT);
};

getData()
  .then(initFilters)
  .catch(showLoadError);
