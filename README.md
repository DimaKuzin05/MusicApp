# MusicApp — музыкальный плеер (Electron + TypeScript)

Учебный проект: ООП, кастомная коллекция, UI-компоненты, отчёт при закрытии.

## Структура проекта

```
MusicApp/
├── package.json
├── tsconfig.json
└── src/
    ├── main/                 # Main-процесс Electron
    │   ├── main.ts           # Окно, диалог файлов, отчёт при выходе
    │   ├── settings.ts       # class Config (аналог settings.py)
    │   └── ReportWriter.ts   # Формирование .txt-отчёта
    └── renderer/             # Интерфейс (Renderer)
        ├── index.html
        ├── styles.css
        ├── app.ts            # Точка входа UI
        ├── AppController.ts  # Связь данных и интерфейса
        ├── core/
        │   ├── BaseEntity.ts
        │   ├── Track.ts
        │   ├── Collection.ts
        │   └── MusicLibrary.ts
        └── ui/
            ├── Component.ts
            ├── Header.ts
            ├── Controls.ts
            ├── TrackList.ts
            ├── VolumeSlider.ts
            ├── StatusBar.ts
            ├── FileLoader.ts
            └── MainWindow.ts
```

## Требования

- [Node.js](https://nodejs.org/) 18+ (рекомендуется LTS)
- npm

## Установка и запуск

```bash
# Клонировать репозиторий
git clone <URL-репозитория>
cd MusicApp

# Установить зависимости
npm install

# Собрать и запустить
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

Формат: таблица `login | time_in | time_out`, время `%d.%m.%Y %H:%M:%S`.

## Соответствие заданию (кратко)

- Классы, наследование от `BaseEntity`, геттеры/сеттеры
- 3 спец. метода у `Track`: `toString`, `toJSON`, `valueOf`
- Сравнимость: `compareTo`, сортировка через `Collection`
- Без `map`/`filter` — кастомный `Collection`
- `Config` в `settings.ts`
- 6 UI-компонентов, `MainWindow`: `init`, `render`, `cleanup`
- ≥10 объектов `Track` при старте

## Сборка .exe (Windows)

На Windows:

```bash
npm install
npm run dist:win
```

Готовые файлы: папка `release/` (установщик NSIS и portable).

> Сборка Windows-версии с macOS может потребовать Wine; надёжнее собирать на Windows.

## Технологии

- [Electron](https://www.electronjs.org/) — десктопное приложение
- TypeScript — типизированный JavaScript
- HTML / CSS (Flex, Grid) — интерфейс

## Лицензия

ISC
