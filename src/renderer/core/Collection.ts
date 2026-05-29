// =============================================================================
// ФАЙЛ: src/renderer/core/Collection.ts
// Слой: доменная модель (core)
// ОТВЕЧАЕТ ЗА: хранение объектов ВМЕСТО list + map/filter из задания
// =============================================================================
// Кастомная коллекция (вместо map/filter)
// [Требование] Запрещён map — используется свой класс Collection

export class Collection<T> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    /** Удаление без .filter() — вручную через forEach */
    remove(item: T): void {
        const next: T[] = [];
        this.forEach((i) => {
            if (i !== item) next.push(i);
        });
        this.items = next;
    }

    count(): number {
        return this.items.length;
    }

    /** Аналог forEach из массива — основной способ обхода */
    forEach(callback: (item: T, index: number) => void): void {
        for (let i = 0; i < this.items.length; i++) {
            callback(this.items[i], i);
        }
    }

    find(predicate: (item: T) => boolean): T | undefined {
        for (const item of this.items) {
            if (predicate(item)) return item;
        }
        return undefined;
    }

    /** Сортировка с использованием compareTo у Track */
    sort(comparator: (a: T, b: T) => number): void {
        this.items.sort(comparator);
    }

    /** Копия элементов — тоже через forEach, не через map */
    toArray(): T[] {
        const copy: T[] = [];
        this.forEach((item) => copy.push(item));
        return copy;
    }
}
