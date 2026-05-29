// =============================================================================
// ФАЙЛ: src/renderer/ui/Component.ts
// Слой: UI — базовый класс для всех визуальных компонентов
// ОТВЕЧАЕТ ЗА: общий интерфейс render() + appendTo()
// =============================================================================
// Базовый UI-класс
// [Требование] Все сущности описаны через классы

export abstract class UIComponent {
    el: HTMLElement; // корневой DOM-элемент компонента

    constructor(tag: string, className: string) {
        this.el = document.createElement(tag);
        this.el.className = className;
    }

    /** Каждый компонент сам строит своё содержимое */
    abstract render(): void;

    /** Вставляет компонент в родительский элемент страницы */
    appendTo(parent: HTMLElement): void {
        parent.appendChild(this.el);
    }
}
