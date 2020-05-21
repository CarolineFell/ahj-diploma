/* eslint-disable no-use-before-define */
/* eslint-disable brace-style */
import TransferMessage from './TransferMessage';
import AudioVideoRecorder from './AudioVideoRecorder';
import Popup from './Popup';
import getGEO from './getGEO';
import ChatBot from './ChatBot';
import {
  conceptWindow, buttonWindow, passwordWindow, messanger, inputPassword, submitPassword,
  typePasswordWindow, buttonSelect, attachment, dropFile, favorits, inputText, popupInput,
  popupWindow, cancelPopup, okPopup, geoTag, exportHistory,
} from './constants';

const uuid = require('uuid');

const popup = new Popup();
popup.init();

let transferMessage = {};
const chatBot = new ChatBot(document.querySelector('.display-messages'));

buttonWindow.addEventListener('click', () => {
  conceptWindow.classList.add('hidden');
  passwordWindow.classList.remove('hidden');
  submitPassword.addEventListener('click', recordAudioVideo);
  inputPassword.addEventListener('keypress', sendPassword);

  function sendPassword(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      recordAudioVideo();
    }
  }
});

async function recordAudioVideo() {
  const password = inputPassword.value;

  if (password) {
    transferMessage = new TransferMessage(password);
    transferMessage.init();

    inputPassword.value = '';
    messanger.classList.remove('hidden');
    typePasswordWindow.classList.add('hidden');
    passwordWindow.classList.add('hidden');
    const recorder = new AudioVideoRecorder(popup, transferMessage);
    recorder.init();
  }

  else if (!password) {
    typePasswordWindow.classList.remove('hidden');

    const timer = 1500;
    setTimeout(closeTypePasswordWindow, timer);
    setTimeout(addInvalid, timer);
    inputPassword.addEventListener('input', () => {
      inputPassword.classList.remove('invalid');
    });
  }
}

function closeTypePasswordWindow() {
  typePasswordWindow.classList.add('hidden');
}

function addInvalid() {
  inputPassword.classList.add('invalid');
}

buttonSelect.addEventListener('change', changeEvent);

function changeEvent(event) {
  const files = Array.from(event.currentTarget.files);
  loadFile(files[0]);
}

attachment.addEventListener('click', addFile);

function addFile() {
  buttonSelect.value = null;
  buttonSelect.dispatchEvent(new MouseEvent('click'));
}

dropFile.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dropFile.addEventListener('drop', dragFile);

function dragFile(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  for (const item of files) {
    loadFile(item);
  }
}

dropFile.addEventListener('scroll', scrollingMessage);

function scrollingMessage(event) {
  if (event.target.scrollTop === 0) {
    transferMessage.lazyLoad();
  }
}

dropFile.addEventListener('click', addFavorite);

function addFavorite(event) {
  const eventTarget = event.target;
  if (eventTarget.classList.contains('favorite')) {
    const parentElement = eventTarget.closest('.message');
    if (eventTarget.classList.contains('favorite')) {
      eventTarget.classList.remove('favorite');
      parentElement.classList.add('not-favorite');
      transferMessage.favoriteOnOff(parentElement.dataset.id, false);
      return;
    }
    eventTarget.classList.add('favorit');
    parentElement.classList.remove('not-favorite');
    transferMessage.favoriteOnOff(parentElement.dataset.id, true);
  }
}

favorits.addEventListener('click', showFavorite);

function showFavorite() {
  if (favorits.classList.contains('favorite')) {
    favorits.classList.remove('favorite');
    favorits.innerHTML = '';
    return;
  }
  favorits.classList.add('favorite');
  favorits.innerHTML = '<style>.not-favorite, .input-field {display: none;}</style>';
}

inputText.addEventListener('keypress', sendText);

function sendText(event) {
  if ((event.keyCode === 13 || event.keyCode === 10) && event.ctrlKey === true) {
    event.preventDefault();

    const regExpBot = /^. /;
    if (inputText.value.search(regExpBot) !== -1) {
      chatBot.communicate(inputText.value);
      inputText.value = '';
      return;
    }

    const objMessage = {
      id: uuid.v4(),
      type: 'text',
      pin: false,
      favorit: false,
      msg: inputText.value,
      dateTime: new Date(),
    };
    transferMessage.sendMessage(objMessage);
    inputText.value = '';
  }
}

cancelPopup.addEventListener('click', popupCancel);

function popupCancel() {
  popupWindow.classList.add('hidden');
  return false;
}

okPopup.addEventListener('click', popupOk);

function popupOk() {
  if (popupInput.classList.contains('hidden')) {
    popupWindow.classList.add('hidden');
  }
}

geoTag.addEventListener('click', getCoords);

async function getCoords() {
  const GEOtag = await getGEO(popup);
  popupWindow.classList.add('hidden');
  const objMessage = {
    id: uuid.v4(),
    type: 'text',
    pin: false,
    favorit: false,
    msg: GEOtag,
    dateTime: new Date(),
  };
  transferMessage.sendMessage(objMessage);
}

exportHistory.addEventListener('click', transferHistory);

async function transferHistory() {
  transferMessage.exportHistory();
}

function loadFile(file) {
  const itemId = uuid.v4();
  const regExp = /[a-z]+/;
  const typeFile = file.type.match(regExp)[0];

  const fr = new FileReader();
  fr.readAsDataURL(file);

  fr.onload = () => {
    const objMessage = {
      id: itemId,
      type: typeFile,
      pin: false,
      favorit: false,
      name: file.name,
      msg: fr.result,
      dateTime: new Date(),
    };
    transferMessage.sendMessage(objMessage);
  };
}