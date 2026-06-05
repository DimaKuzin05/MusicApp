// отвечаетЗА: формирование отчёта и имя файла в папке reports/
// [Требование] Отчёт при закрытии в .txt (таблица login | time_in | time_out)

import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export class ReportWriter {
    /** [Требование] Формат времени %d.%m.%Y %H:%M:%S */
    static formatDateTime(date: Date): string {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${d}.${m}.${y} ${h}:${min}:${s}`;
    }

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

    /** Имя файла с датой сессии, например report_30.05.2026_14-30-00.txt */
    static buildFileName(timeOut: Date): string {
        const stamp = ReportWriter.formatDateTime(timeOut)
            .replace(/ /g, '_')
            .replace(/:/g, '-');
        return `report_${stamp}.txt`;
    }

    /** Создаёт папку reports, если её ещё нет */
    static ensureReportsDir(reportsDir: string): void {
        if (!existsSync(reportsDir)) {
            mkdirSync(reportsDir, { recursive: true });
        }
    }

    /**
     * Сохраняет отчёт в папку reports:
     * - report_<дата>.txt — архив сессии
     * - application_report.txt — последний отчёт
     */
    saveToFolder(
        reportsDir: string,
        login: string,
        timeIn: Date,
        timeOut: Date
    ): { archivePath: string; latestPath: string } {
        ReportWriter.ensureReportsDir(reportsDir);

        const table = ReportWriter.buildTable(login, timeIn, timeOut);
        const archivePath = join(reportsDir, ReportWriter.buildFileName(timeOut));
        const latestPath = join(reportsDir, 'application_report.txt');

        writeFileSync(archivePath, table, 'utf8');
        writeFileSync(latestPath, table, 'utf8');

        return { archivePath, latestPath };
    }
}
