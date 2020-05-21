import Worker from './webWorker';
import PrintMessage from './PrintMessage';
import CryptedKey from './CryptedKey';

const messagesHistory = [];
const urls = 'ahj-diplom-server.herokuapp.com';

export default class TransferMessage {
  constructor(crypt) {
    this.keyCrypt = crypt;
    this.urlWS = `wss://${urls}/ws`;
    this.url = `https://${urls}/`;
    this.crypt = new CryptedKey(crypt);
    this.lazyStart = true;
  }

  async init() {
    this.displayMessages = document.querySelector('.display-messages');
    this.printMsg = new PrintMessage(this.displayMessages, this.crypt);
    this.initWebSocket();
    const initMessage = await fetch(`${this.url}initmsg`);
    await initMessage.text();
    this.lazyLoad();
  }

  initWebSocket() {
    this.webSocket = new WebSocket(this.urlWS);
    this.webSocket.addEventListener('open', () => {});

    this.webSocket.addEventListener('message', (event) => {
      const parsedMessage = JSON.parse(event.data);
      const unLoaded = document.querySelector(`[data-id="${parsedMessage.id}"]`);

      if (unLoaded !== null) {
        unLoaded.classList.remove('loaded');
        return;
      }

      const deCrypt = this.crypt.deCrypt(parsedMessage.msg);

      if (deCrypt && deCrypt !== null) {
        parsedMessage.msg = deCrypt;
        messagesHistory.push(parsedMessage);
        this.printMsg.printMessage(parsedMessage, 'end');
        document
          .querySelector(`[data-id="${parsedMessage.id}"]`)
          .classList.remove('loaded');
      }
    });
  }

  sendMessage(message) {
    messagesHistory.push(message);
    this.printMsg.printMessage(message, 'end');

    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.uploadMessage(message);
    } else {
      this.webSocket = new WebSocket(this.urlWS);
      this.uploadMessage(message);
    }
  }

  uploadMessage(message) {
    const worker = new Worker();
    worker.addEventListener('message', (event) => {
      this.webSocket.send(JSON.stringify(event.data));
      worker.terminate();
    });

    worker.postMessage({
      file: message,
      keyCrypt: this.keyCrypt,
      workCrypt: 'enCrypt',
    });
  }

  async lazyLoad() {
    if (this.lazyStart) {
      this.lazyStart = false;
      const messagesHistoryLength = messagesHistory.length;
      const initMessage = await fetch(`${this.url}msg/${messagesHistoryLength}`);
      const body = await initMessage.json();

      let lengthDown = body.length;
      const worker = new Worker();
      worker.addEventListener('message', (event) => {
        if (event.data.msg && event.data.msg !== null) {
          messagesHistory.push(event.data);
          this.printMsg.printMessage(event.data, 'start');
          document
            .querySelector(`[data-id="${event.data.id}"]`)
            .classList.remove('loaded');
        }
        lengthDown -= 1;
        if (lengthDown === 0) {
          this.lazyStart = true;
        }
      });

      worker.postMessage({
        file: body,
        keyCrypt: this.keyCrypt,
        workCrypt: 'deCrypt',
      });
    }
  }

  favoriteOnOff(idElement, data) {
    const itemIndex = messagesHistory.findIndex((item) => item.id === idElement);
    messagesHistory[itemIndex].favorit = data;

    fetch(`${this.url}favorits`, {
      body: JSON.stringify({
        id: idElement,
        value: data,
      }),
      method: 'POST',
      headers: this.contentTypeHeader,
    });
  }

  async exportHistory() {
    const filename = 'history.json';
    const initMessage = await fetch(`${this.url}allmsg`);
    const body = await initMessage.json();
    const jsonStr = JSON.stringify(body);

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(jsonStr)}`,
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}