/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
import { audioItem, videoItem, save, cancel, timerItem, recordOn, recordOff } from './constants';

const uuid = require('uuid');

const title = 'Что-то пошло не так';

export default class AudioVideoRecorder {
  constructor(popup, transferMsg) {
    this.popup = popup;
    this.transferMsg = transferMsg;
  }

  init() {
    audioItem.addEventListener('click', () => {
      recordOn.classList.add('hidden');
      recordOff.classList.remove('hidden');
      this.audioRecorder();
    });

    videoItem.addEventListener('click', () => {
      recordOn.classList.add('hidden');
      recordOff.classList.remove('hidden');
      this.audioRecorder(true);
    });
  }

  async audioRecorder(recordVideo = false) {
    if (!navigator.mediaDevices) {
      const msg = 'Аудио- и видеозапись не поддерживаются браузером.';
      this.popup.showPopup('', title, msg);
      recordOn.classList.add('hidden');
      recordOff.classList.add('hidden');
      return;
    }
    try {
      let saveCancel = true;
      let timmm = 0;
      let timers = null;

      if (!window.MediaRecorder) {
        const msg = 'Браузеру необходимо разрешение на запись звука.';
        this.popup.showPopup('', title, msg);
        recordOn.classList.add('hidden');
        recordOff.classList.add('hidden');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: recordVideo,
      });

      if (recordVideo) {
        // const mVideo = document.querySelector('#video');
        const mVideo = document.createElement('video');
        mVideo.controls = true;
        mVideo.muted = 'muted';
        mVideo.className = 'mini-video';
        document.body.appendChild(mVideo);
        mVideo.srcObject = stream;
        mVideo.play();
      }

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.start();

      recorder.addEventListener('start', () => {
        timers = setInterval(() => {
          timerItem.innerText = this.setTimer((timmm += 1));
        }, 1000);
      });

      recorder.addEventListener('dataavailable', (evt) => {
        chunks.push(evt.data);
      });

      recorder.addEventListener('stop', async () => {
        clearInterval(timers);
        timerItem.innerText = '00:00';
        if (saveCancel) {
          let curMedia = 'audio';
          if (recordVideo) {
            curMedia = 'video';
          }
          const itemId = uuid.v4();
          const element = document.createElement(curMedia);

          const blob = new Blob(chunks, { type: `${curMedia}/mp4` });

          const fr = new FileReader();
          fr.readAsDataURL(blob);

          fr.onload = () => {
            element.src = fr.result;
            element.controls = true;

            const objMessage = {
              id: itemId,
              type: curMedia,
              pin: false,
              favorit: false,
              msg: fr.result,
              dateTime: new Date(),
            };
            this.transferMsg.sendMessage(objMessage);
          };
        }
        if (recordVideo) {
          document.body.removeChild(document.querySelector('.mini-video'));
        }
        recordOn.classList.remove('hidden');
        recordOff.classList.add('hidden');
      });

      save.addEventListener('click', () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        saveCancel = true;
      });

      cancel.addEventListener('click', () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        saveCancel = false;
      });
    } catch (e) {
      const msg = 'Браузеру необходимо разрешение на запись звука или видео.';
      this.popup.showPopup('', title, msg);
      recordOn.classList.add('hidden');
      recordOff.classList.add('hidden');
    }
  }

  setTimer(seconds) {
    const minuts = Math.floor(seconds / 60);
    const second = seconds - minuts * 60;

    return `${minuts < 10 ? `0${minuts}` : minuts}:${
      second < 10 ? `0${second}` : second
    }`;
  }
}