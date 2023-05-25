

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Миграции

Обязательно после старта проекта сделать миграции
```
npm run migration:generate -- db/migrations/init

npm run migration:run
```
## Тестовые данные

Заполнение бд тестовыми данными

```
npm run seed
```


