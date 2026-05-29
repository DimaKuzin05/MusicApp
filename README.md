# MusicApp — музыкальный плеер (Electron + TypeScript)

Учебный проект: ООП, кастомная коллекция, UI-компоненты, отчёт при закрытии.

**Репозиторий:** https://github.com/DimaKuzin05/MusicApp

## Структура проекта

```
musicApp/
├── package.json
├── tsconfig.json
└── src/
    ├── main/
    │   ├── main.ts          # Main-процесс: создание окна + сохранение отчёта при закрытии
    │   └── settings.ts      # class Config (аналог settings.py)
    │
    └── renderer/
        ├── index.html       # Каркас страницы
        ├── styles.css       # Выравнивание (Flex/Grid)
        ├── app.ts           # Точка входа UI: создание 10 объектов, инициализация
        │
        ├── core/
        │   ├── BaseEntity.ts    # Абстрактный класс
        │   ├── Track.ts         # Сущность: геттеры/сеттеры, сравнение, 3 спец. метода
        │   └── Collection.ts    # Кастомная коллекция (вместо map/filter)
        │
        └── ui/
            ├── Component.ts     # Базовый UI-класс
            ├── Header.ts        # UI компонент 1
            ├── Controls.ts      # UI компонент 2 (Play/Pause/Next/Prev)
            ├── TrackList.ts     # UI компонент 3 (список треков)
            ├── VolumeSlider.ts  # UI компонент 4
            ├── StatusBar.ts     # UI компонент 5
            └── MainWindow.ts    # Контроллер окна (переопределены 3 метода)
```

---

## Описание файлов

### Корень проекта

| Файл | За что отвечает |
|------|-----------------|
| `package.json` | Имя проекта, скрипты (`start`, `build`, `dist:win`), зависимости Electron и electron-builder |
| `tsconfig.json` | Компиляция `src/` → `dist/` (CommonJS, strict mode) |
| `.gitignore` | Исключает `node_modules`, `dist`, `release`, `.idea` и др. |

### `src/main/` — Main-процесс

Работает в Node.js: создаёт окно, диалог файлов, пишет отчёт. **Не рисует интерфейс.**

| Файл | За что отвечает |
|------|-----------------|
| `main.ts` | Запуск Electron, создание `BrowserWindow`, загрузка `index.html`, IPC-обработчик выбора аудиофайлов, сохранение отчёта при `before-quit` |
| `settings.ts` | Класс `Config` — аналог `settings.py`: заголовок окна, размер, имя пользователя, число демо-треков (10), расширения аудио |
| `ReportWriter.ts` | Формирование таблицы отчёта в `.txt`, формат даты `%d.%m.%Y %H:%M:%S`, запись на диск |

### `src/renderer/` — Renderer-процесс

Отображает UI, хранит треки, воспроизводит звук через HTML5 `Audio`.

| Файл | За что отвечает |
|------|-----------------|
| `index.html` | Каркас страницы: подключает `styles.css` и запускает `app.js` |
| `styles.css` | Внешний вид, выравнивание компонентов (Flex / Grid) |
| `app.ts` | Точка входа UI — одна строка: `AppController.start()` |
| `AppController.ts` | Связь данных и интерфейса: создание 10 треков, добавление файлов с диска, обновление плейлиста |

### `src/renderer/core/` — доменная модель (данные)

| Файл | За что отвечает |
|------|-----------------|
| `BaseEntity.ts` | Абстрактный класс сущностей: `id`, абстрактные `getSummary()` и `compareTo()` |
| `Track.ts` | Сущность «трек»: title, artist, duration, filePath; геттеры/сеттеры; `toString`, `toJSON`, `valueOf`; `compareTo`; фабрики `createDemo()`, `fromAudioFile()` |
| `Collection.ts` | Кастомная коллекция вместо `map`/`filter`: `add`, `remove`, `forEach`, `find`, `sort`, `toArray` |
| `MusicLibrary.ts` | Управление коллекцией треков: загрузка 10 демо-объектов, импорт mp3, сортировка, определение длительности файла |

### `src/renderer/ui/` — UI-компоненты

| Файл | За что отвечает |
|------|-----------------|
| `Component.ts` | Базовый UI-класс: DOM-элемент `el`, абстрактный `render()`, `appendTo()` |
| `Header.ts` | **UI 1** — шапка с названием «Музыкальный плеер» |
| `Controls.ts` | **UI 2** — кнопки: Назад, Играть, Пауза, Вперёд |
| `TrackList.ts` | **UI 3** — прокручиваемый список плейлиста, выбор активного трека |
| `VolumeSlider.ts` | **UI 4** — ползунок громкости 0–100% |
| `StatusBar.ts` | **UI 5** — строка состояния внизу (готово, воспроизведение, пауза…) |
| `FileLoader.ts` | **UI 6** — кнопка «+ Добавить файлы» |
| `MainWindow.ts` | Контроллер окна: собирает все компоненты; методы `init()`, `render()`, `cleanup()`; воспроизведение и переключение треков |

### Папки, которых нет в Git (создаются локально)

| Папка | За что отвечает |
|-------|-----------------|
| `node_modules/` | Зависимости после `npm install` |
| `dist/` | Скомпилированный JS после `npm run build` |
| `release/` | Установщик `.exe` / `.dmg` после `npm run dist:win` |

---

## Соответствие требованиям задания

| Требование | Где реализовано |
|------------|-----------------|
| Все сущности описаны через классы | `Track`, `Collection`, `MusicLibrary`, `AppController`, все UI-классы, `ReportWriter`, `Config` |
| Переопределены ≥3 компонента окна | `MainWindow.ts` — методы **`init()`**, **`render()`**, **`cleanup()`** |
| Функциональность через методы класса / `@staticmethod` | `AppController.start()`, `Track.createDemo()`, `Track.fromAudioFile()`, `ReportWriter.formatDateTime()` |
| Сущности наследуются от абстрактного класса | `Track extends BaseEntity` → `BaseEntity.ts` |
| ≥3 специальных метода у пользовательского класса | `Track.ts` — **`toString()`**, **`toJSON()`**, **`valueOf()`** |
| Пользовательские классы сравнимы | `Track.compareTo()` + `MusicLibrary.sort()` |
| Атрибуты с геттерами и сеттерами | `Track.ts` — get/set для `id`, `title`, `artist`, `duration`, `filePath` |
| Запрещён `map` — свой класс для обхода | `Collection.ts` — обход через **`forEach`**, без `.map()` / `.filter()` |
| `settings.py` → модуль `Config` | `src/main/settings.ts` |
| Не менее 5 UI-компонентов | 6 компонентов в `src/renderer/ui/` (Header, Controls, TrackList, VolumeSlider, StatusBar, FileLoader) |
| Не менее 10 пользовательских объектов | `AppController` → `MusicLibrary.loadDemoTracks(10)` → 10 объектов `Track` в `Collection` |
| Все компоненты выровнены | `styles.css` — Flex и Grid |
| Отчёт `.txt` при закрытии | `main.ts` → `ReportWriter.save()` |
| Формат отчёта: таблица login \| time_in \| time_out | `ReportWriter.buildTable()` |
| Формат времени `%d.%m.%Y %H:%M:%S` | `ReportWriter.formatDateTime()` |

---

## Системные требования

- [Node.js](https://nodejs.org/) 18+ (рекомендуется LTS)
- npm

## Установка и запуск

```bash
git clone https://github.com/DimaKuzin05/MusicApp.git
cd MusicApp
npm install
npm start
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm start` | Сборка TypeScript + запуск Electron |
| `npm run build` | Только сборка в `dist/` |
| `npm run clean` | Удалить `dist/` |
| `npm run dist:win` | Сборка `.exe` для Windows (папка `release/`) |
| `npm run dist:mac` | Сборка `.dmg` для macOS |

## Использование

1. При старте загружается **10 демо-треков** (без аудиофайлов).
2. **«+ Добавить файлы»** — выбрать mp3/wav/ogg и др. с диска (в т.ч. из «Загрузки»).
3. Клик по треку в списке — выбор; **Играть** / **Пауза** — воспроизведение (нужен добавленный файл).
4. **Назад** / **Вперёд** — переключение треков.
5. При **закрытии** приложения сохраняется отчёт `application_report.txt`.

### Где лежит отчёт

| ОС | Путь |
|----|------|
| **macOS** | `~/Library/Application Support/musicapp/application_report.txt` |
| **Windows** | `%APPDATA%\musicapp\application_report.txt` |

Пример содержимого:

```
+------------------------------------+
| login          | time_in              | time_out             |
|----------------|----------------------|----------------------|
| MusicAppUser   | 29.05.2026 14:30:00 | 29.05.2026 15:45:00 |
+------------------------------------+
```

## Как работает приложение (кратко)

```
npm start
  → main.ts создаёт окно
  → index.html → app.ts → AppController.start()
  → 10 Track в Collection
  → MainWindow.init() рисует UI
  → «Добавить файлы» → IPC → dialog (main.ts) → importAudioFiles()
  → «Играть» → HTML5 Audio
  → закрытие → ReportWriter → application_report.txt
```

## Сборка .exe (Windows)

```bash
npm install
npm run dist:win
```

Готовые файлы: папка `release/` (установщик NSIS и portable).

> Сборка Windows-версии с macOS может потребовать Wine; надёжнее собирать на Windows.

## Технологии

- [Electron](https://www.electronjs.org/) — десктопное приложение (Main + Renderer)
- TypeScript — типизированный JavaScript
- HTML / CSS (Flex, Grid) — интерфейс

## Лицензия

ISC
