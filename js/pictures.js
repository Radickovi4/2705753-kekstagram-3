
import {showBigPicture} from './big-picture.js';

const pictureTemplate = document.querySelector('#picture').content;
const picturesContainer = document.querySelector('.pictures');

const renderPicture = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const pictureLink = pictureElement.querySelector('.picture');
  const pictureImage = pictureElement.querySelector('.picture__img');
  const pictureLikes = pictureElement.querySelector('.picture__likes');
  const pictureComments = pictureElement.querySelector('.picture__comments');

  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  pictureLikes.textContent = photo.likes;
  pictureComments.textContent = photo.comments.length;

  pictureLink.addEventListener('click', (evt) => {
    evt.preventDefault();
    showBigPicture(photo);
  });

  return pictureElement;
};

const renderPictures = (photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.append(renderPicture(photo));
  });

  picturesContainer.append(fragment);
};

export {renderPictures};
