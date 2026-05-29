// =============================================================================
// ФАЙЛ: src/renderer/ui/VolumeSlider.ts
// UI компонент 4 — ползунок громкости (0–100%)
// Связь с audio.volume — в MainWindow.wireVolume()
// =============================================================================
// UI компонент 4

import { UIComponent } from './Component';

export class VolumeSlider extends UIComponent {
    constructor() {
        super('div', 'volume');
    }

    render(): void {
        this.el.innerHTML = `
            <span class="volume__label">Громкость</span>
            <input type="range" class="volume__slider" min="0" max="100" value="65" />
            <span class="volume__value">65%</span>
        `;

        const input = this.el.querySelector('input') as HTMLInputElement;
        const valueEl = this.el.querySelector('.volume__value') as HTMLElement;
        input.addEventListener('input', () => {
            valueEl.textContent = `${input.value}%`;
        });
    }
}
