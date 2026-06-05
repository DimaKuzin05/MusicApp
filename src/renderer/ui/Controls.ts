
// UI компонент 2 — кнопки: Назад, Играть, Пауза, Вперёд
// Обработчики кликов вешаются в MainWindow.wireControls()
// =============================================================================
// UI компонент 2 (Play/Pause/Next/Prev)
// [Требование] Не менее 5 UI-компонентов

import { UIComponent } from './Component';

export class Controls extends UIComponent {
    constructor() {
        super('div', 'controls');
    }

    render(): void { // ui компонент
        this.el.innerHTML = `
            <button type="button" class="btn btn--ghost" id="prevBtn">Назад</button>
            <button type="button" class="btn btn--primary" id="playBtn">Играть</button>
            <button type="button" class="btn btn--secondary" id="pauseBtn">Пауза</button>
            <button type="button" class="btn btn--ghost" id="nextBtn">Вперёд</button>
        `;
    }
}
