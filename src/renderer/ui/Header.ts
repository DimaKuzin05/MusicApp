// =============================================================================
// ФАЙЛ: src/renderer/ui/Header.ts
// UI компонент 1 из 6 — шапка с названием приложения
// =============================================================================
// UI компонент 1
// [Требование] Не менее 5 UI-компонентов

import { UIComponent } from './Component';

export class Header extends UIComponent {
    constructor() {
        super('header', 'app-header');
    }

    render(): void {
        this.el.innerHTML = `
            <div class="app-header__brand">
                <span class="app-header__icon" aria-hidden="true">♪</span>
                <div>
                    <h1>Музыкальный плеер</h1>
                    <p class="app-header__subtitle">Electron OOP Lab</p>
                </div>
            </div>
        `;
    }
}
