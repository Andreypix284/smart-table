import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            // Переключаем состояние кнопки по карте переходов
            action.dataset.value = sortMap[action.dataset.value];

            // Сохраняем поле и направление сортировки из датасета кнопки
            field = action.dataset.field;
            order = action.dataset.value;

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                // Если это не та кнопка, что нажал пользователь
                if (column.dataset.field !== action.dataset.field) {
                    // Сбрасываем её в начальное состояние 'none'
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {
                // Ищем кнопку, которая не в начальном состоянии
                if (column.dataset.value !== 'none') {
                    // Сохраняем поле и направление сортировки
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        return sortCollection(data, field, order);
    }
}