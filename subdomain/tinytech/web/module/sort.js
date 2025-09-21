import { FloatingWindow } from './style.js';

let sortDirection = {};

function sortTable(columnIndex) {
    const table = document.getElementById('employee-table');
    
    const allRows = Array.from(table.getElementsByTagName('tr'));
    const headerRow = allRows[0];
    const dataRows = allRows.slice(1);
    
    if (dataRows.length === 0) {
        console.log('No data rows to sort');
        return;
    }

    const isAscending = !sortDirection[columnIndex];
    sortDirection[columnIndex] = isAscending;
    
    if (columnIndex === 3) {
        const rowPairs = [];
        for (let i = 0; i < dataRows.length; i += 2) {
            const mainRow = dataRows[i];
            const detailRow = dataRows[i + 1];
            rowPairs.push({ mainRow, detailRow });
        }
        
        rowPairs.sort((a, b) => {
            const aFirst = a.mainRow.cells[1] ? a.mainRow.cells[1].textContent.trim() : '';
            const aLast = a.mainRow.cells[2] ? a.mainRow.cells[2].textContent.trim() : '';
            const bFirst = b.mainRow.cells[1] ? b.mainRow.cells[1].textContent.trim() : '';
            const bLast = b.mainRow.cells[2] ? b.mainRow.cells[2].textContent.trim() : '';
            
            const aFullName = `${aFirst} ${aLast}`;
            const bFullName = `${bFirst} ${bLast}`;
            
            const comparison = aFullName.localeCompare(bFullName);
            return isAscending ? comparison : -comparison;
        });
        
        dataRows.length = 0;
        rowPairs.forEach(pair => {
            dataRows.push(pair.mainRow, pair.detailRow);
        });
        
    } else {
        const actualColumnIndex = columnIndex > 3 ? columnIndex - 1 : columnIndex;
        
        const rowPairs = [];
        for (let i = 0; i < dataRows.length; i += 2) {
            const mainRow = dataRows[i];
            const detailRow = dataRows[i + 1];
            rowPairs.push({ mainRow, detailRow });
        }
        
        rowPairs.sort((a, b) => {
            const aCell = a.mainRow.cells[actualColumnIndex];
            const bCell = b.mainRow.cells[actualColumnIndex];
            
            if (!aCell || !bCell) {
                return 0;
            }
            
            const aValue = aCell.textContent.trim();
            const bValue = bCell.textContent.trim();
            
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            const bothNumeric = !isNaN(aNum) && !isNaN(bNum);
            
            let comparison;
            if (bothNumeric) {
                comparison = aNum - bNum;
            } else if (actualColumnIndex === 3) {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                    comparison = aDate.getTime() - bDate.getTime();
                } else {
                    comparison = aValue.localeCompare(bValue);
                }
            } else {
                comparison = aValue.localeCompare(bValue);
            }
            
            return isAscending ? comparison : -comparison;
        });
        
        dataRows.length = 0;
        rowPairs.forEach(pair => {
            dataRows.push(pair.mainRow, pair.detailRow);
        });
    }
    
    table.innerHTML = '';
    table.appendChild(headerRow);
    dataRows.forEach(row => table.appendChild(row));
    
    updateSortButtons(columnIndex, isAscending);
}

function updateSortButtons(activeIndex, isAscending) {
    const buttons = document.querySelectorAll('.sort-button');
    buttons.forEach((button, index) => {
        button.classList.remove('sort-asc', 'sort-desc');
        if (index == activeIndex) {
            button.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        }
    });
}

new FloatingWindow (
    document,
    document.getElementById('sort-button'),
    document.getElementById('sort-window')
);

document.querySelectorAll('.floating-window .sort-button').forEach(button => {
    button.addEventListener('click', function() {
        sortTable(this.value);
    });
});