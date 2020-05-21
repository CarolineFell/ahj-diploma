/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
import callPopup from './callPopup';
import { popupOk, popupCancel, okPopup, cancelPopup, popupShow } from './popupGEO';

export default function getGEO(popup) {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}, ${longitude}`);
        },
        (error) => {
          const message = 'К сожалению, нам не удалось определить ваше местоположение. Пожалуйста, дайте разрешение на использование геолакации, либо введите координаты вручную. Введите широту и долготу через запятую. Например: 183.12345, 80.54321.';
          callPopup(message, popup);
          popupOk.addEventListener('click', okPopup);
          popupCancel.addEventListener('click', cancelPopup);
        },
      );
    } else {
      const message = 'Браузер не поддерживает автоопределение геолокации. Введите широту и долготу через запятую. Например: 183.12345, 80.54321.';
      callPopup(message, popup);

      popupOk.addEventListener('click', popupShow);
      popupCancel.addEventListener('click', cancelPopup);
    }
  });
}