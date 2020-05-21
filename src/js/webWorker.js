/* eslint-disable no-restricted-globals */
import CryptoJS from 'crypto-js';

function enCrypt(object, cryptedMessage) {
  const message = object;
  const crypt = CryptoJS.AES.encrypt(message.msg, cryptedMessage).toString();
  message.msg = crypt;
  return message;
}

function deCrypt(object, cryptedMessage) {
  try {
    const message = object;
    const decryptedMessage = CryptoJS.AES.decrypt(message, cryptedMessage);
    const cryptedString = decryptedMessage.toString(CryptoJS.enc.Utf8);
    return cryptedString;
  } catch (e) {
    return null;
  }
}

self.addEventListener('message', async (event) => {
  let content = '';
  if (event.data.workCrypt === 'enCrypt') {
    content = await enCrypt(event.data.file, event.data.keyCrypt);
    self.postMessage(content);
  } else if (event.data.workCrypt === 'deCrypt') {
    for (const item of event.data.file) {
      const parsedItem = JSON.parse(item);
      content = deCrypt(parsedItem.msg, event.data.keyCrypt);
      parsedItem.msg = content;
      self.postMessage(parsedItem);
    }
    self.close();
  }
});