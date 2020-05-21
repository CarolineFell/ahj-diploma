/* eslint-disable class-methods-use-this */
import printTime from './printTime';

export default class ChatBot {
  constructor(parentElement) {
    this.hello = [
      'И тебе привет',
      'День добрый',
      'Давно не виделись',
      'И тебе. Как дела?',
      'Сколько лет, сколько зим!',
    ];
    this.howAreYou = [
      'Да вроде ничего',
      'Погодка шепчет',
      'Супер. У тебя?',
      'Отлично. Ты сам-то как?',
      'Грустненько как-то, ну да прорвёмся',
      'Вот ты пришёл, и сразу лучше стало',
    ];
    this.weather = [
      'С утра пасмурно, но во второй половине дня должно быть солнечно',
      'Тепло и солнечно',
      'Вроде как ливень обещали',
      'Сегодня холодно. Может быть, даже заморозки',
      'Молчи. И без тебя тошно',
      'Принимаю заказы. Какие пожелания?',
      'Какой бы прогноз на сегодня устроить...',
      'Как бы это сказать. Ещё не проверял',
    ];
    this.plans = [
      'Планы? Да какие у меня планы',
      'Давай думать вместе. Может, кино глянем?',
      'Ну... Чего-нибудь вкусненького бы...',
      'Что делать, что делать. Работать, что ж ещё',
      'Да уже всё сделал. И даже больше',
      'Ты, что ль, знаешь, что это такое?',
      'Кроватка... Хочу в кроватку',
    ];
    this.food = [
      'И ты ещё можешь думать о еде? Сейчас?',
      'Может, острого рамёнчика навернём?',
      'Ооо, ну, тут целый простор для фантазий',
      'Может, чайку? А там посмотрим',
      'Да вот смотрю на сухой корм и думаю...',
      'Да я тут от голода скоро чревовещанием буду промышлять. Давай думать',
      'Не говори о еде. Сейчас помру с голода',
    ];
    this.secretary = [
      'Да-да, сейчас... Где-то тут записано было',
      'Погодите-ка... Это с каких пор я у тебя секретарь?',
      'Так-с, что тут у нас. На сегодня пусто',
      'Работа на удалёнке, что же ещё',
      'Расписание у тебя, конечно... Даже не знаю, что сказать',
      'Может, лучше поедим?',
      'Как же это было... Точно. Как говорится, работа не волк...',
    ];
    this.parentElement = parentElement;
  }

  communicate(msg) {
    let messageHTML = '';
    let message = document.createElement('div');
    message.className = 'message not-favorite';
    message.innerHTML = `${msg}
    <div class="footer-message">
      <div class="date-time">${printTime(new Date())}</div>
    </div>
    `;
    this.parentElement.appendChild(message);

    const question = msg.replace(/^. /, '');

    switch (question) {
      case 'привет':
        messageHTML = this.randomMessages(this.hello);
        break;
      case 'как дела?':
        messageHTML = this.randomMessages(this.howAreYou);
        break;
      case 'какая на сегодня погода?':
        messageHTML = this.randomMessages(this.weather);
        break;
      case 'какие планы?':
        messageHTML = this.randomMessages(this.plans);
        break;
      case 'чего бы поесть?':
        messageHTML = this.randomMessages(this.food);
        break;
      case 'рассписание на сегодня':
        messageHTML = this.randomMessages(this.secretary);
        break;
      default:
        messageHTML = 'Не понимаю, о чём речь. Я ещё учусь, поэтому прошу выразиться точнее';
        break;
    }

    message = document.createElement('div');
    message.className = 'message not-favorite bot';
    message.innerHTML = `${messageHTML}
    <div class="footer-message">
      <div class="date-time">${printTime(new Date())}</div>
    </div>
    `;
    this.parentElement.appendChild(message);
    this.parentElement.scrollTo(0, message.offsetTop);
  }

  randomMessages(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
}