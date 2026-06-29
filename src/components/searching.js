// export function initSearching(searchField) {
//     return (data, state, action) => {
//         // @todo: #5.2 — применить компаратор
//         // Если поле поиска пустое или не существует, возвращаем все данные
//         const searchValue = state[searchField];
//         if (!searchValue || searchValue.trim() === '') {
//             return data;
//         }

//         const searchLower = searchValue.toLowerCase().trim();
        
//         // Ручная фильтрация по нескольким полям
//         return data.filter(row => {
//             // Проверяем все поля, которые должны участвовать в поиске
//             const fields = ['date', 'customer', 'seller'];
            
//             return fields.some(field => {
//                 const value = row[field];
//                 if (value === undefined || value === null) return false;
//                 return String(value).toLowerCase().includes(searchLower);
//             });
//         });
//     };
// }
import { createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        // Если поле поиска пустое или не существует, возвращаем все данные
        const searchValue = state[searchField];
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }

        const searchLower = searchValue.toLowerCase().trim();
        
        // Ручная фильтрация по нескольким полям
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