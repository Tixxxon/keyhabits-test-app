# keyhabbits-backend

Бекенд часть для тестового задания keyhabits

## Установка пакетов

В первую очередь нужно установить пакеты
```sh
yarn install
```

## Установка переменных окружения
 
Для корректной работы, необходимо установить переменные окружения в файле .env

```sh
HOST=localhost
PORT=3000

NODE_ENV=production

DB_HOST=<DB_PI>
DB_NAME=<DB_NAME>
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>
```

Таблицы для базы данных создадутся автоматически при первом подключении

## Запуск


```sh
yarn start
```

После запуска будет выведено следующее сообщение

```sh
init table: car_models success
init table: car_brands success
init table: shops success
init table: phones success
init table: shop_phones success
init table: shop_cars success
Init models success
Server started: http://localhost:3000
```

Говорящее о том, что таблицы успешно созданы и сервер запустился