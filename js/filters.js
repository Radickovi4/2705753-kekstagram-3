
import {renderPictures} from './pictures.js';

const RANDOM_PHOTOS_COUNT = 10;
const RERENDER_DELAY = 500;

const imgFilters = document.querySelector('.img-filters');
const filterButtons = imgFilters.querySelectorAll('.img-filters__button');

let photos = [];

const getRandomPhotos = (photosArray) => {
  const shuffledPhotos = photosArray.slice();

  for (let i = shuffledPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPhotos[i], shuffledPhotos[j]] = [
      shuffledPhotos[j],
      shuffledPhotos[i],
    ];
  }

  return shuffledPhotos.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photosArray) =>
  photosArray.slice().sort(
    (photoA, photoB) =>
      photoB.comments.length - photoA.comments.length
  );

const debounce = (callback, timeoutDelay) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...rest);
    }, timeoutDelay);
  };
};

const renderFilteredPhotos = debounce((filterId) => {
  switch (filterId) {
    case 'filter-random':
      renderPictures(getRandomPhotos(photos));
      break;

    case 'filter-discussed':
      renderPictures(getDiscussedPhotos(photos));
      break;

    case 'filter-default':
    default:
      renderPictures(photos);
      break;
  }
}, RERENDER_DELAY);

const onFilterButtonClick = (evt) => {
  const clickedButton = evt.target.closest('.img-filters__button');

  if (!clickedButton) {
    return;
  }

  if (clickedButton.classList.contains('img-filters__button--active')) {
    return;
  }

  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  clickedButton.classList.add('img-filters__button--active');

  renderFilteredPhotos(clickedButton.id);
};

const initFilters = (loadedPhotos) => {
  photos = loadedPhotos;

  renderPictures(photos);
  imgFilters.classList.remove('img-filters--inactive');

  imgFilters.addEventListener('click', onFilterButtonClick);
};

export {initFilters};
