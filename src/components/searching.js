import { rules, createComparison } from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    // Создаем компаратор с правилами для поиска
    const compare = createComparison(
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        // Если поле поиска пустое или не существует, возвращаем все данные
        if (!state[searchField] || state[searchField].trim() === '') {
            return data;
        }

        // Фильтруем данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}
