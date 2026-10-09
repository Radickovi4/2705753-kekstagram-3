import {photos} from './posts.js';

const pictureTemplate = document.querySelector('#picture').content;
const picturesContainer = document.querySelector('.pictures');

const renderPicture = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const pictureImage = pictureElement.querySelector('.picture__img');
  const pictureLikes = pictureElement.querySelector('.picture__likes');
  const pictureComments = pictureElement.querySelector('.picture__comments');

  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  pictureLikes.textContent = photo.likes;
  pictureComments.textContent = photo.comments.length;

  return pictureElement;
};

const picturesFragment = document.createDocumentFragment();

photos.forEach((photo) => {
  const pictureElement = renderPicture(photo);
  picturesFragment.append(pictureElement);
});

picturesContainer.append(picturesFragment);
