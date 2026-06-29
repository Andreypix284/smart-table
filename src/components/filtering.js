import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
// Создаем компаратор с правилами для фильтрации
const compare = createComparison(
    defaultRules,
    [
        // Добавляем правило для диапазона чисел
        (state, row) => {
            // Проверяем totalFrom (минимальная сумма)
            if (state.totalFrom && state.totalFrom !== '' && state.totalFrom !== '0') {
                const from = parseFloat(state.totalFrom);
                const total = parseFloat(row.total);
                if (!isNaN(from) && !isNaN(total) && total < from) {
                    return false;
                }
            }

            // Проверяем totalTo (максимальная сумма)
            if (state.totalTo && state.totalTo !== '' && state.totalTo !== '0') {
                const to = parseFloat(state.totalTo);
                const total = parseFloat(row.total);
                if (!isNaN(to) && !isNaN(total) && total > to) {
                    return false;
                }
            }

            // Проверяем seller (продавец)
            if (state.seller && state.seller !== '') {
                if (row.seller !== state.seller) {
                    return false;
                }
            }

            // Проверяем date (дата)
            if (state.date && state.date !== '') {
                if (!row.date || !row.date.includes(state.date)) {
                    return false;
                }
            }

            // Проверяем customer (покупатель)
            if (state.customer && state.customer !== '') {
                if (!row.customer || !row.customer.includes(state.customer)) {
                    return false;
                }
            }

            return true;
        }
    ]
);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        const element = elements[elementName];
        if (element) {
            // Очищаем select и добавляем опцию "Все"
            element.innerHTML = '<option value="">Все</option>';

            // Добавляем опции из индексов
            // Используем Set для уникальных значений
            const uniqueValues = new Set(Object.values(indexes[elementName]));
            uniqueValues.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                element.appendChild(option);
            });

        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;

            // Находим соответствующий элемент фильтра
            if (fieldName && elements[fieldName]) {
                const element = elements[fieldName];

                // Сбрасываем значение
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0;
                    state[fieldName] = '';
                } else if (element.tagName === 'INPUT') {
                    element.value = '';
                    state[fieldName] = '';
                }

            }

            return data;
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        // Проверяем, есть ли активные фильтры
        const hasActiveFilters = Object.keys(state).some(key => {
            const value = state[key];
            // Проверяем только поля фильтрации
            if (key === 'totalFrom' || key === 'totalTo' || key === 'seller' || key === 'date' || key === 'customer') {
                return value && value !== '' && value !== '0';
            }
            return false;
        });

        // Если нет активных фильтров, возвращаем все данные
        if (!hasActiveFilters) {
            return data;
        }

        // Применяем фильтрацию
        return data.filter(row => compare(row, state));
    };
}
