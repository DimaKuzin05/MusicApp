// =============================================================================
// ФАЙЛ: src/renderer/ui/TrackList.ts
// UI компонент 3 — прокручиваемый список треков плейлиста
// =============================================================================
// UI компонент 3 (список треков)

import { UIComponent } from './Component';

/** Данные одной строки списка (не путать с классом Track) */
export interface TrackListItem {
    title: string;
    artist: string;
    duration: string;
    filePath?: string;
}

export class TrackList extends UIComponent {
    private listEl!: HTMLUListElement;
    private activeIndex = 0;
    private onSelect?: (index: number) => void;

    constructor() {
        super('section', 'track-list');
    }

    render(): void {
        this.el.innerHTML = `<h2 class="track-list__title">Плейлист</h2>`;
        this.listEl = document.createElement('ul');
        this.listEl.className = 'track-list__items';
        this.el.appendChild(this.listEl);
    }

    /** Заполняет список; подсвечивает активный трек */
    setItems(items: TrackListItem[]): void {
        this.listEl.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className =
                'track-list__item' + (index === this.activeIndex ? ' track-list__item--active' : '');
            li.innerHTML = `
                <span class="track-list__index">${index + 1}</span>
                <div class="track-list__info">
                    <span class="track-list__name">${item.title}</span>
                    <span class="track-list__meta">${item.artist} · ${item.duration}</span>
                </div>
            `;
            li.addEventListener('click', () => {
                this.setActive(index);
                this.onSelect?.(index);
            });
            this.listEl.appendChild(li);
        });
    }

    /** Подписка на клик по треку (вызывается из AppController) */
    onItemSelect(callback: (index: number) => void): void {
        this.onSelect = callback;
    }

    setActive(index: number): void {
        this.activeIndex = index;
        const items = this.listEl.querySelectorAll('.track-list__item');
        items.forEach((el, i) => {
            el.classList.toggle('track-list__item--active', i === index);
        });
    }

    getActiveIndex(): number {
        return this.activeIndex;
    }
}
