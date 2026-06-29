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
            const firstOption = element.querySelector('option[value=""]');
            // Очищаем select
            element.innerHTML = '';

            if (firstOption) {
                element.appendChild(firstOption);
            } else {
                const optionAll = document.createElement('option');
                optionAll.value = '';
                optionAll.textContent = 'Все';
                element.appendChild(optionAll);
            }
            // Добавляем опции из индексов
            Object.values(indexes[elementName]).forEach(name => {
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

                // Находим родительский элемент кнопки
                const parent = action.closest('.filter-group') || action.parentElement;
                // Ищем input внутри родительского элемента
                const input = parent?.querySelector('input, select');

                if (input) {
                    // Сбрасываем значение
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else {
                        input.value = '';
                    }
                    state[fieldName] = input.tagName === 'SELECT'
                        ? input.options[0]?.value || ''
                        : '';
                }
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}