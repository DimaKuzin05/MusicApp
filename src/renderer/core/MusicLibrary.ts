// ОТВЕЧАЕТ ЗА: управление коллекцией треков (добавление, сортировка, импорт)
// [Требование] Хранение пользовательских объектов в кастомной коллекции

import { Collection } from './Collection';
import { Track } from './Track';

export class MusicLibrary {
    private tracks = new Collection<Track>();
    private nextId = 1; // счётчик id для новых треков

    /** [Требование] Создаёт 10 демо-объектов Track при запуске */
    loadDemoTracks(count: number): void {
        for (let i = 0; i < count; i++) {
            this.tracks.add(Track.createDemo(this.nextId));
            this.nextId += 1;
        }
    }

    /** Добавляет треки из выбранных путей к файлам */
    importAudioFiles(paths: string[], onUpdated?: () => void): number {
        let added = 0;
        paths.forEach((filePath) => {
            const track = Track.fromAudioFile(this.nextId, filePath);
            this.nextId += 1;
            this.tracks.add(track);
            added += 1;
            this.probeDuration(track, onUpdated); // узнать длительность из метаданных mp3
        });
        return added;
    }

    /** Сортировка коллекции по compareTo */
    sort(): void {
        this.tracks.sort((a, b) => a.compareTo(b));
    }

    count(): number {
        return this.tracks.count();
    }

    getTracks(): Collection<Track> {
        return this.tracks;
    }

    getByIndex(index: number): Track | undefined {
        let current = 0;
        let found: Track | undefined;
        this.tracks.forEach((t) => {
            if (current === index) found = t;
            current += 1;
        });
        return found;
    }

    /** Читает длительность аудио через HTML5 Audio (асинхронно) */
    private probeDuration(track: Track, onUpdated?: () => void): void {
        if (!track.filePath) return;

        const { pathToFileURL } = require('url') as typeof import('url');
        const audio = new Audio();
        audio.src = pathToFileURL(track.filePath).href;
        audio.addEventListener('loadedmetadata', () => {
            if (Number.isFinite(audio.duration)) {
                track.duration = Math.round(audio.duration);
                onUpdated?.(); // обновить список в UI
            }
        });
        audio.addEventListener('error', () => {
            track.duration = 0;
        });
    }
}
