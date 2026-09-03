const PHOTO_COUNT = 25;
const LIKE_MIN = 15;
const LIKE_MAX = 200;
const COMMENT_MIN = 0;
const COMMENT_MAX = 30;
const AVATAR_MIN = 1;
const AVATAR_MAX = 6;

const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const COMMENT_NAMES = [
  'Артём', 'Мария', 'Дмитрий', 'Ольга', 'Сергей', 'Анна',
  'Иван', 'Елена', 'Павел', 'Ксения', 'Николай', 'Виктория',
];

const PHOTO_DESCRIPTIONS = [
  'Закат над морем',
  'Горы в тумане',
  'Уютное кафе',
  'Осень в парке',
  'Поля и холмы',
  'Спящий котёнок',
  'Ночной город',
  'Лодки на рассвете',
  'Цветущий сад',
  'Зимний лес',
  'Завтрак в постель',
  'Старый собор',
  'Велопрогулка',
  'Бурное море',
  'Звёздное небо',
  'Рассвет в горах',
  'Уличные музыканты',
  'Пикник у реки',
  'Мост вечером',
  'Лавандовые поля',
  'Крыши города',
  'Костёр у озера',
  'Фруктовый рынок',
  'Дождь за окном',
  'Лесная дорога',
];

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


const getRandomArrayElement = (elements) =>
  elements[getRandomInteger(0, elements.length - 1)];


const createIdGenerator = () => {
  let currentId = 0;
  return () => ++currentId;
};

const generateCommentId = createIdGenerator();

const createCommentMessage = () => {
  const sentenceCount = getRandomInteger(1, 2);
  const sentences = new Set();

  while (sentences.size < sentenceCount) {
    sentences.add(getRandomArrayElement(COMMENT_MESSAGES));
  }

  return [...sentences].join(' ');
};

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(AVATAR_MIN, AVATAR_MAX)}.svg`,
  message: createCommentMessage(),
  name: getRandomArrayElement(COMMENT_NAMES),
});

const createPhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: PHOTO_DESCRIPTIONS[index],
  likes: getRandomInteger(LIKE_MIN, LIKE_MAX),
  comments: Array.from(
    { length: getRandomInteger(COMMENT_MIN, COMMENT_MAX) },
    createComment
  ),
});

const photos = Array.from({ length: PHOTO_COUNT }, (_, index) =>
  createPhoto(index)
);
