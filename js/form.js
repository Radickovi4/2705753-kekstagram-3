
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

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

const COMMENTS_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const normalizeHashtags = (value) =>
  value.trim().split(/\s+/).filter(Boolean);

const validateHashtags = (value) => {
  const hashtags = normalizeHashtags(value);

  if (hashtags.length === 0) {
    return true;
  }

  if (hashtags.length > MAX_HASHTAGS) {
    return false;
  }

  const normalizedHashtags = hashtags.map((hashtag) =>
    hashtag.toLowerCase()
  );

  if (new Set(normalizedHashtags).size !== normalizedHashtags.length) {
    return false;
  }

  return hashtags.every((hashtag) =>
    hashtag.length <= MAX_HASHTAG_LENGTH &&
    COMMENTS_PATTERN.test(hashtag)
  );
};

const validateDescription = (value) =>
  value.length <= MAX_COMMENT_LENGTH;

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

let currentScale = DEFAULT_SCALE;

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

const updateScale = (scale) => {
  currentScale = Math.min(
    SCALE_MAX,
    Math.max(SCALE_MIN, scale)
  );

  scaleInput.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
};

smallerButton.addEventListener('click', () => {
  updateScale(currentScale - SCALE_STEP);
});

biggerButton.addEventListener('click', () => {
  updateScale(currentScale + SCALE_STEP);
});

const applyEffect = (effectName, value) => {
  const effect = effects[effectName];

  if (effect.filter === 'none') {
    previewImage.style.filter = 'none';
  } else {
    previewImage.style.filter =
      `${effect.filter}(${value}${effect.unit})`;
  }

  effectLevelValue.value = value;
};

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

effectLevelSlider.noUiSlider.on('update', (values, handle) => {
  const value = Number(values[handle]);
  const selectedEffect = effectsList.querySelector(
    'input[name="effect"]:checked'
  );

  if (selectedEffect) {
    applyEffect(selectedEffect.value, value);
  }
});

const onEffectChange = (evt) => {
  if (!evt.target.matches('input[name="effect"]')) {
    return;
  }

  const effectName = evt.target.value;
  const effect = effects[effectName];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max,
    },
    step: effect.step,
  });

  effectLevelSlider.noUiSlider.set(effect.start);

  effectLevel.classList.toggle('hidden', effectName === 'none');

  applyEffect(effectName, effect.start);
};

effectsList.addEventListener('change', onEffectChange);

const resetImageSettings = () => {
  updateScale(DEFAULT_SCALE);

  const originalEffect = effectsList.querySelector(
    'input[name="effect"][value="none"]'
  );

  if (originalEffect) {
    originalEffect.checked = true;
  }

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effects.none.min,
      max: effects.none.max,
    },
    step: effects.none.step,
  });

  effectLevelSlider.noUiSlider.set(effects.none.start);

  previewImage.style.filter = 'none';
  effectLevelValue.value = effects.none.start;
  effectLevel.classList.add('hidden');
};

const openUploadForm = () => {
  resetImageSettings();
  pristine.reset();

  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  uploadForm.reset();
  fileInput.value = '';

  resetImageSettings();
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
