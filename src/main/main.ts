// ПРОЦЕСС: Main (Electron)
// ОТВЕЧАЕТ ЗА: окно, диалог файлов, сохранение отчётов в папку reports/
// [Требование] Отчёт .txt при закрытии приложения

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { Config } from './settings';
import { ReportWriter } from './ReportWriter';

let mainWindow: BrowserWindow | null = null;
let sessionStart: Date | null = null;
let reportSaved = false;

/** Папка для отчётов: при разработке — MusicApp/reports/, в .exe — Документы/MusicApp/reports/ */
function getReportsDir(): string {
    if (!app.isPackaged) {
        return join(app.getAppPath(), Config.REPORTS_DIR);
    }
    return join(app.getPath('documents'), Config.REPORT_FOLDER, Config.REPORTS_DIR);
}

/** [Требование] Сохранение отчёта в папку reports (один раз за сессию) */
function saveSessionReport(): void {
    if (reportSaved) return;
    reportSaved = true;

    const timeIn = sessionStart ?? new Date();
    const timeOut = new Date();
    const reportsDir = getReportsDir();

    const { archivePath, latestPath } = new ReportWriter().saveToFolder(
        reportsDir,
        Config.USER_NAME,
        timeIn,
        timeOut
    );

    console.log('Отчёты сохранены в папку:', reportsDir);
    console.log('  архив сессии:', archivePath);
    console.log('  последний:   ', latestPath);
}

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: Config.WINDOW_WIDTH,
        height: Config.WINDOW_HEIGHT,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    mainWindow.setTitle(Config.APP_TITLE);

    mainWindow.on('close', () => {
        saveSessionReport();
    });
}

app.whenReady().then(() => {
    sessionStart = new Date();
    ReportWriter.ensureReportsDir(getReportsDir());
    createWindow();
});

ipcMain.handle('pick-audio-files', async () => {
    if (!mainWindow) return [];

    const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Добавить музыку',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Аудио', extensions: Config.AUDIO_EXTENSIONS }],
    });

    return result.canceled ? [] : result.filePaths;
});

app.on('before-quit', () => {
    saveSessionReport();
});

app.on('window-all-closed', () => {
    saveSessionReport();
    app.quit();
});
