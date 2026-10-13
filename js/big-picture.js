const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsShownCount = bigPicture.querySelector('.social__comment-shown-count');
const commentsTotalCount = bigPicture.querySelector('.social__comment-total-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const renderComments = (comments) => {
  const fragment = document.createDocumentFragment();

  comments.forEach((comment) => {
    const commentElement = document.createElement('li');
    commentElement.classList.add('social__comment');

    const avatar = document.createElement('img');
    avatar.classList.add('social__picture');
    avatar.src = comment.avatar;
    avatar.alt = comment.name;
    avatar.width = 35;
    avatar.height = 35;

    const text = document.createElement('p');
    text.classList.add('social__text');
    text.textContent = comment.message;

    commentElement.append(avatar);
    commentElement.append(text);
    fragment.append(commentElement);
  });

  socialComments.replaceChildren(fragment);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    closeBigPicture();
  }
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

const showBigPicture = (photo) => {
  bigPictureImage.src = photo.url;
  likesCount.textContent = photo.likes;
  commentsShownCount.textContent = photo.comments.length;
  commentsTotalCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  renderComments(photo.comments);

  commentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};

closeButton.addEventListener('click', closeBigPicture);

export {showBigPicture};
