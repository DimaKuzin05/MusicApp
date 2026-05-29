// =============================================================================
// ФАЙЛ: src/main/ReportWriter.ts
// ПРОЦЕСС: Main
// ОТВЕЧАЕТ ЗА: формирование и запись отчёта в .txt при закрытии
// =============================================================================
// [Требование] Отчёт при закрытии в .txt (таблица login | time_in | time_out)

export class ReportWriter {
    /** [Требование] Формат времени %d.%m.%Y %H:%M:%S — например 29.05.2026 14:30:00 */
    static formatDateTime(date: Date): string {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${d}.${m}.${y} ${h}:${min}:${s}`;
    }
    /** Собирает текст таблицы по шаблону из задания */
    static buildTable(login: string, timeIn: Date, timeOut: Date): string {
        const inStr = ReportWriter.formatDateTime(timeIn);
        const outStr = ReportWriter.formatDateTime(timeOut);
        return (
            '+------------------------------------+\n' +
            '| login          | time_in              | time_out             |\n' +
            '|----------------|----------------------|----------------------|\n' +
            `| ${login.padEnd(14)} | ${inStr} | ${outStr} |\n` +
            '+------------------------------------+\n'
        );
    }

    /** Записывает отчёт на диск */
    save(filePath: string, login: string, timeIn: Date, timeOut: Date): void {
        const { writeFileSync } = require('fs') as typeof import('fs');
        writeFileSync(filePath, ReportWriter.buildTable(login, timeIn, timeOut), 'utf8');
    }
}
