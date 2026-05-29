// =============================================================================
// ФАЙЛ: src/renderer/ui/StatusBar.ts
// UI компонент 5 — строка состояния внизу окна
// =============================================================================
// UI компонент 5
// [Требование] Не менее 5 UI-компонентов

import { UIComponent } from './Component';

export class StatusBar extends UIComponent {
    constructor() {
        super('footer', 'status-bar');
    }

    render(): void {
        this.el.textContent = 'Готово';
    }

    update(text: string): void { //** Меняет текст статуса (воспроизведение, пауза, добавление файлов…) */
        this.el.textContent = text;
    }
}
