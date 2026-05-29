// =============================================================================
// ФАЙЛ: src/renderer/AppController.ts
// ПРОЦЕСС: Renderer
// ОТВЕЧАЕТ ЗА: связь между данными (MusicLibrary) и интерфейсом (MainWindow)
// =============================================================================
// [Требование] Вся функциональность через методы класса
// [Требование] Не менее 10 пользовательских объектов Track в Collection

import { ipcRenderer } from 'electron';
import { Config } from '../main/settings';
import { MusicLibrary } from './core/MusicLibrary';
import { Track } from './core/Track';
import { MainWindow } from './ui/MainWindow';
import { TrackListItem } from './ui/TrackList';

export class AppController {
    private library = new MusicLibrary(); // хранилище треков
    private ui: MainWindow; // главное окно и все UI-компоненты

    constructor() {
        this.ui = new MainWindow(document.body);
    }

    /** [Требование] Статический метод — фабрика запуска приложения */
    static start(): void {
        new AppController().run();
    }

    /** Главный сценарий: демо-треки → UI → обработчики кнопок */
    run(): void {
        // [Требование] Создание 10 пользовательских объектов Track
        this.library.loadDemoTracks(Config.TRACKS_COUNT);
        this.library.sort(); // сортировка через compareTo

        this.ui.init();
        this.ui.onAddFiles(() => this.addFilesFromDisk());
        this.refreshPlaylist();

        // Клик по треку в списке
        this.ui.getTrackList().onItemSelect((index) => {
            this.ui.selectTrack(index);
        });
    }

    /** Открывает системный диалог (main.ts) и добавляет выбранные файлы в библиотеку */
    private async addFilesFromDisk(): Promise<void> {
        const paths: string[] = await ipcRenderer.invoke('pick-audio-files');
        if (paths.length === 0) return;

        const added = this.library.importAudioFiles(paths, () => this.refreshPlaylist());
        this.library.sort();
        this.refreshPlaylist();
        this.ui.getStatus().update(`Добавлено файлов: ${added}. Всего: ${this.library.count()}`);
    }

    /** Передаёт актуальный список треков в UI (без map — только forEach) */
    private refreshPlaylist(): void {
        const items: TrackListItem[] = [];
        this.library.getTracks().forEach((t: Track) => {
            items.push({
                title: t.title,
                artist: t.artist,
                duration: AppController.formatDuration(t.duration),
                filePath: t.filePath || undefined,
            });
        });
        this.ui.bindPlaylist(items);
    }

    /** Секунды → строка "3:45" для отображения в списке */
    private static formatDuration(seconds: number): string {
        if (!seconds || seconds <= 0) return '--:--';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    }
}
