// =============================================================================
// ФАЙЛ: src/main/settings.ts
// Аналог settings.py из задания
// ОТВЕЧАЕТ ЗА: все настройки приложения в одном месте (класс Config)
// =============================================================================
// class Config (аналог settings.py)
// [Требование] Модуль конфигурации приложения

export class Config {
    static readonly APP_TITLE = 'Music Electron Lab';
    static readonly REPORT_FILE = 'application_report.txt'; // имя файла отчёта
    static readonly USER_NAME = 'MusicAppUser'; // login в таблице отчёта
    static readonly TRACKS_COUNT = 10; // [Требование] не менее 10 объектов при старте
    static readonly WINDOW_WIDTH = 440;
    static readonly WINDOW_HEIGHT = 760;
    static readonly AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];
}
