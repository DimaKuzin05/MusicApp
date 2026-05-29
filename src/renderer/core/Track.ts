// =============================================================================
// ФАЙЛ: src/renderer/core/Track.ts
// Слой: доменная модель (core)
// ОТВЕЧАЕТ ЗА: сущность «трек» — данные одной песни
// =============================================================================
// Сущность: геттеры/сеттеры, сравнение, 3 спец. метода
// [Требование] Наследование от абстрактного класса BaseEntity
// [Требование] Геттеры и сеттеры атрибутов
// [Требование] Сравнимость (compareTo)
// [Требование] Переопределены 3 спец. метода: toString, toJSON, valueOf

import { BaseEntity } from './BaseEntity';

export class Track extends BaseEntity {
    private _title: string;
    private _artist: string;
    private _duration: number; // длительность в секундах
    private _filePath: string; // путь к mp3 на диске (если добавлен файл)

    constructor(id: number, title: string, artist: string, duration: number, filePath = '') {
        super(id);
        this._title = title;
        this._artist = artist;
        this._duration = duration;
        this._filePath = filePath;
    }

    // --- [Требование] Геттеры и сеттеры ---
    get id(): number { return this._id; }
    set id(v: number) { this._id = v; }

    get title(): string { return this._title; }
    set title(v: string) { this._title = v; }

    get artist(): string { return this._artist; }
    set artist(v: string) { this._artist = v; }

    get duration(): number { return this._duration; }
    set duration(v: number) { this._duration = v; }

    get filePath(): string { return this._filePath; }
    set filePath(v: string) { this._filePath = v; }

    // --- [Требование] 3 специальных метода ---
    toString(): string {
        return `${this._title} - ${this._artist}`;
    }

    toJSON(): object {
        return { id: this._id, title: this._title, artist: this._artist, duration: this._duration, filePath: this._filePath };
    }

    valueOf(): number {
        return this._id;
    }

    // --- [Требование] Сравнимость ---
    compareTo(other: BaseEntity): number {
        return this._id - (other instanceof Track ? other.id : 0);
    }

    getSummary(): string {
        return `${this._title} (${this._duration}s)`;
    }

    /** [Требование] @staticmethod — создаёт демо-трек при старте приложения */
    static createDemo(id: number): Track {
        return new Track(id, `Трек ${id}`, `Исполнитель ${id}`, 180 + id * 10);
    }

    /** Создаёт трек из реального файла с диска */
    static fromAudioFile(id: number, filePath: string): Track {
        const meta = Track.parseFileName(filePath);
        return new Track(id, meta.title, meta.artist, 0, filePath);
    }

    /** Парсит имя файла "Исполнитель - Название.mp3" */
    static parseFileName(filePath: string): { title: string; artist: string } {
        const path = require('path') as typeof import('path');
        const base = path.basename(filePath, path.extname(filePath));
        const parts = base.split(' - ');
        if (parts.length >= 2) {
            return { artist: parts[0].trim(), title: parts.slice(1).join(' - ').trim() };
        }
        return { title: base, artist: 'Неизвестный исполнитель' };
    }
}
