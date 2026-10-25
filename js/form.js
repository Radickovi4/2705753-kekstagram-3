import {sendData} from './api.js';

const MAX_HASHTAGS = 5;
const MIN_HASHTAG_LENGTH = 2;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9-]+$/i;
const EFFECT_SELECTOR = 'input[name="effect"]';
const ORIGINAL_EFFECT_SELECTOR = 'input[name="effect"][value="none"]';
const SUCCESS_TEMPLATE = document.querySelector('#success');
const ERROR_TEMPLATE = document.querySelector('#error');
const SUCCESS_MESSAGE_SELECTOR = 'section';
const MESSAGE_BUTTON_SELECTOR = 'button';
const SUBMIT_BUTTON_SELECTOR = '.img-upload__submit';

const uploadForm = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const closeButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const previewImage = document.querySelector('.img-upload__preview img');
const scaleInput = document.querySelector('.scale__control--value');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const effectsList = document.querySelector('.effects__list');
const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const submitButton = uploadForm.querySelector(SUBMIT_BUTTON_SELECTOR);

const normalizeHashtags = (value) =>
  value.trim().split(/\s+/).filter(Boolean);

const areHashtagsValid = (value) => {
  const hashtags = normalizeHashtags(value);

  return hashtags.every((hashtag) =>
    hashtag.length >= MIN_HASHTAG_LENGTH &&
    hashtag.length <= MAX_HASHTAG_LENGTH &&
    HASHTAG_PATTERN.test(hashtag)
  );
};

const hasValidHashtagCount = (value) =>
  normalizeHashtags(value).length <= MAX_HASHTAGS;

const hasUniqueHashtags = (value) => {
  const hashtags = normalizeHashtags(value).map((hashtag) => hashtag.toLowerCase());

  return new Set(hashtags).size === hashtags.length;
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
  areHashtagsValid,
  'Хэштег должен начинаться с # и содержать от 2 до 20 символов: только буквы, цифры и дефис.'
);
pristine.addValidator(
  hashtagsInput,
  hasValidHashtagCount,
  `Нельзя указывать больше ${MAX_HASHTAGS} хэштегов.`
);
pristine.addValidator(
  hashtagsInput,
  hasUniqueHashtags,
  'Хэштеги не должны повторяться.'
);
pristine.addValidator(
  descriptionInput,
  validateDescription,
  `Комментарий должен содержать не более ${MAX_COMMENT_LENGTH} символов.`
);

let currentScale = DEFAULT_SCALE;
let previewUrl = null;
let isMessageOpen = false;

const effects = {
  none: {
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: '',
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    start: 3,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    start: 3,
    unit: '',
  },
};

let selectedEffect = effectsList.querySelector(`${EFFECT_SELECTOR}:checked`);

const updateScale = (scale) => {
  currentScale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, scale));
  scaleInput.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
};

const applyEffect = (effectName, value) => {
  const effect = effects[effectName];
  previewImage.style.filter = effect.filter === 'none'
    ? 'none'
    : `${effect.filter}(${value}${effect.unit})`;
  effectLevelValue.value = value;
};

noUiSlider.create(effectLevelSlider, {
  range: {min: 0, max: 100},
  start: 100,
  step: 1,
  connect: 'lower',
});

effectLevelSlider.noUiSlider.on('update', (values, handle) => {
  if (selectedEffect) {
    applyEffect(selectedEffect.value, Number(values[handle]));
  }
});

const resetImageSettings = () => {
  updateScale(DEFAULT_SCALE);
  selectedEffect = effectsList.querySelector(ORIGINAL_EFFECT_SELECTOR);

  if (selectedEffect) {
    selectedEffect.checked = true;
  }

  effectLevelSlider.noUiSlider.updateOptions({
    range: {min: effects.none.min, max: effects.none.max},
    step: effects.none.step,
  });
  effectLevelSlider.noUiSlider.set(effects.none.start);
  previewImage.style.filter = 'none';
  effectLevelValue.value = effects.none.start;
  effectLevel.classList.add('hidden');
};

const onSmallerButtonClick = () => updateScale(currentScale - SCALE_STEP);
const onBiggerButtonClick = () => updateScale(currentScale + SCALE_STEP);

smallerButton.addEventListener('click', onSmallerButtonClick);
biggerButton.addEventListener('click', onBiggerButtonClick);

const onEffectChange = (evt) => {
  if (!evt.target.matches(EFFECT_SELECTOR)) {
    return;
  }

  selectedEffect = evt.target;
  const effect = effects[selectedEffect.value];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {min: effect.min, max: effect.max},
    step: effect.step,
  });
  effectLevelSlider.noUiSlider.set(effect.start);
  effectLevel.classList.toggle('hidden', selectedEffect.value === 'none');
  applyEffect(selectedEffect.value, effect.start);
};

effectsList.addEventListener('change', onEffectChange);

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset();

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }

  fileInput.value = '';
  resetImageSettings();
  pristine.reset();
  document.removeEventListener('keydown', onDocumentKeydown);
};
const onCloseUploadForm = closeUploadForm;

function onDocumentKeydown(evt) {
  if (isMessageOpen || evt.key !== 'Escape') {
    return;
  }

  if (document.activeElement === hashtagsInput || document.activeElement === descriptionInput) {
    return;
  }

  closeUploadForm();
}

const openUploadForm = () => {
  resetImageSettings();
  pristine.reset();
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const onFileInputChange = () => {
  const [file] = fileInput.files;

  if (!file) {
    return;
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(file);
  previewImage.src = previewUrl;
  openUploadForm();
};

fileInput.addEventListener('change', onFileInputChange);
closeButton.addEventListener('click', onCloseUploadForm);

const showFormMessage = (type) => {
  const template = type === 'success' ? SUCCESS_TEMPLATE : ERROR_TEMPLATE;
  const messageFragment = template.content.cloneNode(true);
  const message = messageFragment.querySelector(SUCCESS_MESSAGE_SELECTOR);
  const button = message.querySelector(MESSAGE_BUTTON_SELECTOR);

  document.body.append(message);
  isMessageOpen = true;

  const closeMessage = () => {
    message.remove();
    isMessageOpen = false;
    document.removeEventListener('keydown', onMessageKeydown);
  };
  const onCloseMessageButtonClick = closeMessage;

  function onMessageKeydown(evt) {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
      closeMessage();
    }
  }

  const onMessageClick = (evt) => {
    if (evt.target === message) {
      closeMessage();
    }
  };

  button.addEventListener('click', onCloseMessageButtonClick);
  message.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onMessageKeydown);
};

const onUploadFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  submitButton.disabled = true;

  sendData(new FormData(uploadForm))
    .then(() => {
      closeUploadForm();
      showFormMessage('success');
    })
    .catch(() => {
      showFormMessage('error');
    })
    .finally(() => {
      submitButton.disabled = false;
    });
};

uploadForm.addEventListener('submit', onUploadFormSubmit);
