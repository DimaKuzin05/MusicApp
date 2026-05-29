// =============================================================================
// ФАЙЛ: src/renderer/ui/FileLoader.ts
// UI компонент 6 — кнопка «Добавить файлы»
// По клику AppController вызывает диалог через IPC (main.ts)
// =============================================================================
// UI компонент 6 — загрузка аудиофайлов с диска
// [Требование] Не менее 5 UI-компонентов (дополнительный)

import { UIComponent } from './Component';

export class FileLoader extends UIComponent {
    constructor() {
        super('div', 'file-loader');
    }

    render(): void {
        this.el.innerHTML = `
            <button type="button" class="btn btn--add" id="addFilesBtn">+ Добавить файлы</button>
        `;
    }

    /** Подключает обработчик — обычно вызывает addFilesFromDisk() в AppController */
    onAddClick(handler: () => void): void {
        const btn = this.el.querySelector('#addFilesBtn');
        btn?.addEventListener('click', handler);
    }
}
