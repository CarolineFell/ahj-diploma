[![Build status](https://ci.appveyor.com/api/projects/status/r5k4psexy5ht64k2/branch/master?svg=true)](https://ci.appveyor.com/project/CarolineFell/ahj-diploma/branch/master)

https://carolinefell.github.io/ahj-diploma/

## Реализованные функции

### Обязательные

- Сохранение в истории ссылок и текстовых сообщений +
- Ссылки (то, что начинается с http:// или https://) должны быть кликабельны и отображаться как ссылки +

ФОТО

- Сохранение в истории изображений, видео и аудио (как файлов) - через Drag & Drop и через иконку загрузки (скрепка в большинстве мессенджеров) +

ФОТО

- Скачивание файлов (на компьютер пользователя) +

ФОТО

- Ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т.д. +


### Дополнительные


// - Синхронизация - если приложение открыто в нескольких окнах (вкладках), то контент должен быть синхронизирован
// - Поиск по сообщениям (интерфейс + реализация на сервере)

- Запись видео и аудио (используя API браузера) +

ФОТО

- Отправка геолокации +

//

- Воспроизведение видео/аудио (используя API браузера) +

ФОТО

// - Установка напоминаний и напоминания (через Notification API), например @schedule: 18:04 31.08.2019 "Последний день лета"

- Отправка команд боту, например: @chaos: погода, бот должен отвечать рандомный прогноз погоды (интегрироваться с реальными сервисами не требуется), команд должно быть не менее 5 +

ФОТО

// - Закрепление (pin) сообщений, закреплять можно только одно сообщение (прикрепляется к верхней части страницы)

ФОТО

- Добавление сообщения в избранное (тогда должен быть интерфейс для просмотра избранного) +

ФОТО

// - Просмотр вложений по категориям, например: аудио, видео, изображения, другие файлы (см. боковую меню Telegram)
// - Работа в оффлайн-режиме (при это загруженные сообщения должны кэшироваться и быть доступными после обновления страницы)
// - Экспорт/импорт истории чата

- Отправка зашифрованных сообщений и файлов (привет crypto-js!) с просмотром расшированных (для этого нужно ввести пароль) - важно эта функция засчитывается за две +

// - Архивирование файлов и распаковка (см. zip.js)

- Поддержка оформления кода, например, при отправке сообщения в бэктиках +

// - Поддержка смайликов (emoji)
// - Поддержка стикеров