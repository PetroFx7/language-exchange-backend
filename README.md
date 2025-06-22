# Language Exchange Backend

 **Using Node.js + Express – recommended**

Це бекенд-застосунок для платформи мовного обміну. Реалізовано на Node.js з використанням Express, PostgreSQL та JWT для авторизації.

---

##  ENV-змінні

Створіть файл `.env` у корені проєкту з таким вмістом:
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=language_exchange
JWT_SECRET=your_jwt_secret_key
PORT=5000

Міграції

```bash
npx sequelize-cli db:migrate
```
Запуск сервера

```bash
npm install
npm start
```

Сервер буде доступний за адресою: http://localhost:5000

Основні ендпоінти API
 Аутентифікація
POST /auth/register – реєстрація нового користувача

POST /auth/login – логін та отримання JWT токена

 Користувач
GET /users/me – отримати поточний профіль

PUT /users/me/languages – оновити рідну та цільові мови

 Пошук
GET /search – пошук партнерів за мовними параметрами

 Запити
POST /requests – створити запит на обмін

GET /requests – переглянути отримані/надіслані запити

PUT /requests/:id – оновити статус (прийняти / відхилити)

Технології
Node.js

Express

PostgreSQL

JWT – для аутентифікації

Автор
Petro F.
GitHub – @PetroFx7

