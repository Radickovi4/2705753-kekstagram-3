const uploadForm = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/i;

const normalizeHashtags = (value) => value.trim().split(/\s+/).filter(Boolean);

const validateHashtags = (value) => {
  const hashtags = normalizeHashtags(value);

  if (hashtags.length === 0) {
    return true;
  }

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  const normalizedHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  if (new Set(normalizedHashtags).size !== normalizedHashtags.length) {
    return false;
  }

  return hashtags.every((hashtag) =>
    hashtag.length <= MAX_HASHTAG_LENGTH && hashtagPattern.test(hashtag)
  );
};

const validateDescription = (value) => value.length <= MAX_COMMENT_LENGTH;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'has-danger',
  successClass: 'has-success',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'pristine-error',
});

pristine.addValidator(
  hashtagsInput,
  validateHashtags,
  'Хэштеги должны начинаться с #, содержать от 2 до 20 символов, не повторяться. Максимум 5 хэштегов.'
);

pristine.addValidator(
  descriptionInput,
  validateDescription,
  'Комментарий должен содержать не более 140 символов.'
);

const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  uploadForm.reset();
  fileInput.value = '';
  pristine.reset();

  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (evt.key !== 'Escape') {
    return;
  }

  if (
    document.activeElement === hashtagsInput ||
    document.activeElement === descriptionInput
  ) {
    return;
  }

  closeUploadForm();
}

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    openUploadForm();
  }
});

closeButton.addEventListener('click', closeUploadForm);

uploadForm.addEventListener('submit', (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
});
