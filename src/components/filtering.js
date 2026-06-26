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
    Object.keys(indexes)
        .forEach((elementName) => {
            if (elements[elementName]) {
                // Сохраняем первую опцию "Все"
                const firstOption = elements[elementName].querySelector('option[value=""]');
                if (firstOption) {
                    elements[elementName].innerHTML = '<option value="">Все</option>';
                }

                elements[elementName].append(
                    ...Object.values(indexes[elementName])
                        .map(name => {
                            const option = document.createElement('option');
                            option.value = name;
                            option.textContent = name;
                            return option;
                        })
                );
            }
        });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset.field;

            // Находим соответствующий элемент фильтра
            if (fieldName && elements[fieldName]) {
                const element = elements[fieldName];

                // Сбрасываем значение в зависимости от типа элемента
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0; // выбираем первый option (обычно "Все")
                } else if (element.tagName === 'INPUT') {
                    element.value = '';
                }

                // Сбрасываем в state
                if (state[fieldName] !== undefined) {
                    state[fieldName] = element.tagName === 'SELECT'
                        ? element.options[0]?.value || ''
                        : '';
                }
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}  