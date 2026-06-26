import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;    // приведём количество страниц к числу
    const page = parseInt(state.page) || 1;
    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения
    // @todo: использование
    // Обработка сброса всех фильтров
    if (action && action.name === 'reset-filters') {
        // Находим все поля ввода в контейнере таблицы
        const inputs = sampleTable.container.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'number' || input.type === 'search') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            }
        });
        // Обновляем state после очистки
        state = collectState();
        state.page = 1;
    }

    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);

    return {                                            // расширьте существующий return вот так
        ...state,
        rowsPerPage: state.rowsPerPage,
        page: state.page
    };
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        if (input) input.value = page;
        if (input) input.checked = isCurrent;
        if (label) label.textContent = page;
        return el;
    }
);
// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
// Инициализация фильтрации
const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    { searchBySeller: indexes.sellers }
);
// Инициализация поиска
const applySearching = initSearching('search');
// Добавляем таблицу в DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
