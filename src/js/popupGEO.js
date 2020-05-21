/* eslint-disable no-undef */
export const popupOk = document.querySelector('.popup-ok');
export const popupCancel = document.querySelector('.popup-cancel');

export function okPopup() {
  popup.showPopup('valid GEO', error);
  if (popup.validate()) {
    resolve(popupInp.value);
  }
}

export function cancelPopup() {
  reject('cancel');
}

export function popupShow() {
  popup.showPopup('validGEO ok');
  if (popup.validate()) {
    resolve(popupInp.value);
  }
}