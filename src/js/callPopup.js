export default function callPopup(message, popup) {
  const title = 'Что-то пошло не так';
  popup.showPopup('get', title, message);
}