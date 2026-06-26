import { rules, createComparison } from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        // Если поле поиска пустое или не существует, возвращаем все данные
        const searchValue = state[searchField];
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }

        // Ручная фильтрация по нескольким полям
        const searchLower = searchValue.toLowerCase().trim();

        return data.filter(row => {
            // Проверяем все поля, которые должны участвовать в поиске
            const fields = ['date', 'customer', 'seller'];

            return fields.some(field => {
                const value = row[field];
                if (value === undefined || value === null) return false;
                return String(value).toLowerCase().includes(searchLower);
            });
        });
    };
}
