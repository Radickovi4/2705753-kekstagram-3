
const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const getData = () =>
  fetch(`${BASE_URL}/data`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить фотографии');
      }

      return response.json();
    });

const sendData = (body) =>
  fetch(BASE_URL, {
    method: 'POST',
    body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось отправить форму');
      }

      return response;
    });

export {getData, sendData};
