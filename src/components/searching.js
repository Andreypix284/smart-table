import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        { skipEmptyTargetValues: true },
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        // Если поле поиска пустое или не существует, возвращаем все данные
        const searchValue = state[searchField];
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }

        // Применяем компаратор для поиска
        return data.filter(row => compare(row, state));
    };
}