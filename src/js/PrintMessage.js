/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import printTime from './printTime';

export default class PrintMessage {
  constructor(parentElement, cryptedMessage) {
    this.parentElement = parentElement;
    this.cryptedMessage = cryptedMessage;
  }

  printMessage(object, phase) {
    const message = object.msg;
    let messageHTML = '';

    switch (object.type) {
      case 'text':
        messageHTML = this.printText(message);
        break;
      case 'image':
        messageHTML = this.printImage(message, object.name);
        break;
      case 'video':
        messageHTML = this.printVideo(message, object.name);
        break;
      case 'audio':
        messageHTML = this.printAudio(message, object.name);
        break;
      default:
        messageHTML = this.printDocument(message, object.name);
        break;
    }

    const newMessage = document.createElement('div');
    newMessage.className = 'message not-favorite loaded';
    newMessage.dataset.id = object.id;
    newMessage.innerHTML = `${messageHTML}
    <div class="footer-message">
      <div class="favorite sidebar${object.favorit ? ' favorite' : ''}"></div>
      <div class="date-time">${printTime(object.dateTime)}</div>
    </div>`;

    if (phase === 'end') {
      this.parentElement.appendChild(newMessage);
      this.parentElement.scrollTo(0, newMessage.offsetTop);
    } else {
      this.parentElement.prepend(newMessage);
    }
  }

  printText(message) {
    const regExp = /(https?:\/\/)[%:\w.\/-]+/;
    const regExpCode = /```(.|\n)*?```/;
    let linkMessage = message;

    if (linkMessage === '') {
      result = null;
    }

    if (linkMessage === '. ') {
      result = null;
    }

    if (message.search(regExp) !== -1) {
      linkMessage = message.replace(regExp, `<a href="${message.match(regExp)[0]}">${message.match(regExp)[0]}</a>`);
    }

    if (message.search(regExpCode) !== -1) {
      const textCode = message.match(regExpCode)[0].replace(/```\n?/g, '');
      const highlightedCode = hljs.highlightAuto(textCode.trim()).value;
      linkMessage = message.replace(regExpCode, `<pre><code>${highlightedCode}</code></pre>`);
    }
    return `${linkMessage}`;
  }

  printImage(img, name) {
    const messageHTML = `
      <img src="${img}">
      <p class="name">${name}</p>
      <a class="download sidebar" href="${img}" download="image"></a>
    `;
    return `${messageHTML}`;
  }

  printVideo(obj, name) {
    const messageHTML = `
      <video src="${obj}" controls="controls"></video>
      <p class="name">${name}</p>
      <a class="download sidebar" href="${obj}" download="video"></a>
    `;
    return `${messageHTML}`;
  }

  printAudio(obj, name) {
    const messageHTML = `
      <audio src="${obj}" controls="controls"></audio>
      <p class="name">${name}</p>
      <a class="download sidebar" href="${obj}" download="audio"></a>
    `;
    return `${messageHTML}`;
  }

  printDocument(obj, name) {
    const messageHTML = `
      <div class="document"></div>
      <p class="name">${name}</p>
      <a class="download sidebar" href="${obj}" download="app"></a>
    `;
    return `${messageHTML}`;
  }
}