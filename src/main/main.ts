// =============================================================================
// ФАЙЛ: src/main/main.ts
// ПРОЦЕСС: Main (Electron) — работает в Node.js, без доступа к DOM
// ОТВЕЧАЕТ ЗА: запуск приложения, окно, диалог файлов, отчёт при выходе
// =============================================================================
// Main-процесс: создание окна + сохранение отчёта при закрытии
// [Требование] Отчёт .txt при закрытии приложения

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Config } from './settings';
import { ReportWriter } from './ReportWriter';

let mainWindow: BrowserWindow | null = null;
let sessionStart: Date | null = null; // время входа для отчёта time_in
function createWindow(): void { //Создаёт главное окно и загружает HTML из renderer
    mainWindow = new BrowserWindow({
        width: Config.WINDOW_WIDTH,
        height: Config.WINDOW_HEIGHT,
        webPreferences: {
            nodeIntegration: true, // renderer может использовать require('electron')
            contextIsolation: false,
        },
    });

    // После сборки путь: dist/renderer/index.html
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    mainWindow.setTitle(Config.APP_TITLE);
}

// Запуск приложения: запоминаем время начала сессии
app.whenReady().then(() => {
    sessionStart = new Date();
    createWindow();
});

// [Требование] IPC: renderer вызывает этот обработчик через ipcRenderer.invoke(...)
// Возвращает массив путей к выбранным mp3/wav и т.д.
ipcMain.handle('pick-audio-files', async () => {
    if (!mainWindow) return [];

    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Добавить музыку',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Аудио', extensions: Config.AUDIO_EXTENSIONS }],
    });

    return result.canceled ? [] : result.filePaths;
});

// [Требование] При закрытии — сохранить отчёт в userData/application_report.txt
app.on('before-quit', () => {
    const timeIn = sessionStart ?? new Date();
    const timeOut = new Date();

    const appData = app.getPath('userData');
    if (!existsSync(appData)) mkdirSync(appData, { recursive: true });

    const reportPath = join(appData, Config.REPORT_FILE);
    new ReportWriter().save(reportPath, Config.USER_NAME, timeIn, timeOut);
});
