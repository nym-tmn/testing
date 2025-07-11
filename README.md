// Чтобы запустить все unit-тесты и интеграционные тесты необходимо выполнить следующую команду

		npm test

// Чтобы запустить e2e-тесты и скриншот тесты необходимо выполнить следующие команды

		1. Запустить Storybook на http://localhost:6006
		npm run storybook

		2. В другом терминале
		npm run cypress:run:app - запускает e2e-тесты в headless режиме
		или
		npm run cypress:open:app - запускает e2e-тесты в GUI режиме
		или
		npm run cypress:run:storybook - запускает скриншот-тесты в headless режим
		или
		npm run cypress:open:storybook - запускает скриншот-тесты в GUI режим

		npm run cypress:update:storybook - если требуется обновить скриншоты

// Пользовательские сценарии

1. Авторизация

Успешная авторизация:
Пользователь нажимает "Авторизоваться"
Появляется модальное окно
Вводит корректные данные (Email: test@mail.ru/Пароль: 12345678)
Нажимает "Войти"
Происходит имитация запроса на сервер с задержкой в 2 сек., в это время кнопка "Войти" имеет состояние disabled и в ней отображается тект "Processing..."
После ответа сервера состояние кнопки "Войти" восстанавливается
Видит сообщение "Вы авторизованы!!!"
Появляется кнопка "Выйти"
После авторизации происходит реальный запрос на сервер за получением пользователей
Отображается список пользователей

Неудачная авторизация (неверные данные):
Пользователь dводит неверные данные (любые, кроме test@mail.ru/12345678)
Получает ошибку "Неверный логин или пароль"
Форма сохраняет введенные данные
Кнопка "Войти" снова активна
События submit не происходит

2. Валидация формы

Пустые поля:
Оставляет поля пустыми
Нажимает "Войти"
Видит ошибки ("Email обязателен"/"Пароль обязателен")

Невалидный email:
Вводит test@ (некорректный формат)
Видит ошибку "Введите корректный email"

Невалидный пароль:
Вводит пароль короче 8 символов (например, 123)
Видит ошибку "Пароль должен быть не короче 8 символов"
Вводит спецсимволы (например, @#$#wbewbh)
Видит ошибку "Пароль может состоять только из цифр"

3. Состояния интерфейса

Загрузка при авторизации:
При нажатии "Войти":
Кнопка меняется на "Processing..."
Кнопка disabled
После ответа сервера состояние кнопки восстанавливается

Закрытие модального окна:
Нажимает "X" или кликает вне формы или при нажатии на Escape
Форма закрывается
Поля сбрасываются
Ошибки очищаются

4. Выход из системы
Пользователь нажимает "Выйти"
Возвращается в начальное состояние:
Кнопка "Авторизоваться"
Список пользователей скрыт
При повторной авторизации требуется ввод данных

5. Повторная авторизация
После выхода снова открывает форму
Поля должны быть пустыми
Ошибки сброшены