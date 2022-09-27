# SDET Test Task

##Coding task:
Требуется написать автотест на проверку наличия трейлера у видео.

Результатом должен являться автотест написанный на PHP с использованием фреймворка codeception, либо на Typescript с использованием фреймворка Playwright

Сценарий:
1. Открыть https://yandex.ru/video/
2. Ввести в поиск “ураган”
3. Дождаться результатов поиска
4. Навести курсор мыши на любое видео из левого блока
5. Проверить, что у видео есть трейлер (превью картинка изменяется)


##Introduction: 
- Language - TypeScript
- Test platform - Playwright

##Step 1. Install Packages:
```
npm i
```

##Step 2. Run test:
```
npx playwright test 
```
