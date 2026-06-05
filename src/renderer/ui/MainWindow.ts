
// Слой: UI — контроллер (собирает все компоненты на экране)
// ОТВЕЧАЕТ ЗА: разметка окна, воспроизведение, переключение треков
// Контроллер окна (переопределены 3 метода: init, render, cleanup)
// [изТЗ] Переопределены 3 компонента окна

import { UIComponent } from './Component';
import { Header } from './Header';
import { Controls } from './Controls';
import { FileLoader } from './FileLoader';
import { TrackList, TrackListItem } from './TrackList';
import { VolumeSlider } from './VolumeSlider';
import { StatusBar } from './StatusBar';

export class MainWindow {
    private container: HTMLElement;
    private shell!: HTMLElement;
    private playerPanel!: HTMLElement;
    private components: UIComponent[] = [];
    private header: Header;
    private fileLoader: FileLoader;
    private controls: Controls;
    private list: TrackList;
    private slider: VolumeSlider;
    private status: StatusBar;
    private nowPlayingTitle!: HTMLElement;
    private nowPlayingArtist!: HTMLElement;
    private playlist: TrackListItem[] = [];
    private audio = new Audio(); // HTML5-плеер для mp3

    constructor(parent: HTMLElement) {
        this.container = parent;
        this.header = new Header();
        this.fileLoader = new FileLoader();
        this.controls = new Controls();
        this.list = new TrackList();
        this.slider = new VolumeSlider();
        this.status = new StatusBar();
    }

    /** [Требование] Метод 1 из 3 — инициализация: render всех компонентов + обработчики */
    init(): void {
        this.components = [
            this.header,
            this.fileLoader,
            this.controls,
            this.slider,
            this.list,
            this.status,
        ];
        this.components.forEach((c) => c.render());
        this.render();
        this.wireControls();
        this.wireVolume();
    }

    /** [Требование] Метод 2 из 3 — построение DOM-дерева на странице */
    render(): void {
        this.container.className = 'app';
        this.container.innerHTML = '';

        this.shell = document.createElement('div');
        this.shell.className = 'app-shell';

        this.playerPanel = document.createElement('section');
        this.playerPanel.className = 'player-panel';
        this.playerPanel.innerHTML = `
            <div class="now-playing">
                <div class="now-playing__art">🎵</div>
                <p class="now-playing__title">—</p>
                <p class="now-playing__artist">Выберите трек</p>
            </div>
        `;
        this.nowPlayingTitle = this.playerPanel.querySelector('.now-playing__title')!;
        this.nowPlayingArtist = this.playerPanel.querySelector('.now-playing__artist')!;

        this.header.appendTo(this.shell);
        this.shell.appendChild(this.playerPanel);
        this.fileLoader.appendTo(this.playerPanel);
        this.controls.appendTo(this.playerPanel);
        this.slider.appendTo(this.playerPanel);
        this.list.appendTo(this.shell);
        this.status.appendTo(this.shell);

        this.container.appendChild(this.shell);
    }

    /** [Требование] Метод 3 из 3 — очистка при закрытии / уничтожении окна */
    cleanup(): void {
        this.audio.pause();
        this.audio.src = '';
        this.container.innerHTML = '';
        this.container.className = '';
    }

    onAddFiles(handler: () => void): void {
        this.fileLoader.onAddClick(handler);
    }

    /** Обновляет список на экране */
    bindPlaylist(items: TrackListItem[]): void {
        this.playlist = items;
        this.list.setItems(items);
        if (items.length > 0) {
            this.list.setActive(0);
            this.selectTrack(0);
        }
    }
    /** Выбор трека: обновляет «сейчас играет» и подготавливает audio.src */
    selectTrack(index: number): void {
        const item = this.playlist[index];
        if (!item) return;

        this.list.setActive(index);
        this.nowPlayingTitle.textContent = item.title;
        this.nowPlayingArtist.textContent = item.artist;
        this.status.update(`Выбран: ${item.title}`);

        if (item.filePath) {
            const { pathToFileURL } = require('url') as typeof import('url');
            this.audio.src = pathToFileURL(item.filePath).href;
            this.audio.load();
        }
    }
    getTrackList(): TrackList {
        return this.list;
    }

    getStatus(): StatusBar {
        return this.status;
    }

    /** Кнопки Назад / Играть / Пауза / Вперёд */
    private wireControls(): void {
        const playBtn = this.playerPanel.querySelector('#playBtn');
        const pauseBtn = this.playerPanel.querySelector('#pauseBtn');
        const prevBtn = this.playerPanel.querySelector('#prevBtn');
        const nextBtn = this.playerPanel.querySelector('#nextBtn');

        playBtn?.addEventListener('click', () => {
            const item = this.playlist[this.list.getActiveIndex()];
            if (item?.filePath) {
                this.audio.play().catch(() => {
                    this.status.update('Не удалось воспроизвести файл');
                });
                this.status.update(`Воспроизведение: ${item.title}`);
            } else {
                this.status.update('Добавьте аудиофайл через «Добавить файлы»');
            }
        });

        pauseBtn?.addEventListener('click', () => {
            this.audio.pause();
            this.status.update('Пауза');
        });

        prevBtn?.addEventListener('click', () => this.changeTrack(-1));
        nextBtn?.addEventListener('click', () => this.changeTrack(1));
    }

    private wireVolume(): void {
        const input = this.slider.el.querySelector('input') as HTMLInputElement | null;
        input?.addEventListener('input', () => {
            this.audio.volume = Number(input.value) / 100;
        });
    }

    /** Переключение на предыдущий/следующий трек по кругу */
    private changeTrack(delta: number): void {
        if (this.playlist.length === 0) return;
        const next =
            (this.list.getActiveIndex() + delta + this.playlist.length) % this.playlist.length;
        this.selectTrack(next);
    }
}
