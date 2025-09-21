import { languagePack, ready } from './language/language.js';

ready.then(() => {
    languagePack.addCustomTranslation('home.table.search.placeholder', (control, data) => {
        control.placeholder = data;
    });}
);

function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function removeHighlights(element) {
    const highlights = element.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        highlight.outerHTML = highlight.innerHTML;
    });
}

// I wanted to refactor this function since it's quite long but I ran out of time
function searchTable() {
    const searchInput = document.getElementById('table-search').value.toLowerCase().trim();
    let searchTerm = searchInput;
    let targetColumnId = null;

    // This is important for searching by specific column
    if (searchTerm.includes(':')) {
        const colonIndex = searchTerm.indexOf(':');
        const potentialColumnId = searchTerm.substring(0, colonIndex);
        const actualSearchTerm = searchTerm.substring(colonIndex + 1);
        
        // Get all header cells to find matching column
        const headerCells = document.getElementById("employee-table").getElementsByTagName('th');
        for (let i = 0; i < headerCells.length; i++) {
            const headerId = headerCells[i].id;
            // Extract the last part of the id (e.g., "first-name" from "home.table.column.first-name")
            const columnName = headerId.split('.').pop();
            if (columnName === potentialColumnId) {
                targetColumnId = i;
                searchTerm = actualSearchTerm;
                break;
            }
        }
    }

    console.log(targetColumnId);
    console.log(searchTerm);

    const employeeRows = document.querySelectorAll('.employee-row');
    let visibleRows = 0;

    employeeRows.forEach(row => {
        removeHighlights(row);
    });

    employeeRows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        let rowMatches = false;
        const employeeId = row.getAttribute('employee-id');

        const searcher = (cell) => {
            const cellText = cell.textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                rowMatches = true;
                if (searchTerm) {
                    cell.innerHTML = highlightText(cell.textContent, searchTerm);
                }
            } else if (searchTerm.includes(cellText)) {
                rowMatches = true;
                if (searchTerm) {
                    cell.innerHTML = highlightText(cell.textContent, cellText);
                }
            }
        };

        if (targetColumnId !== null) {
            searcher(cells[targetColumnId]);
        } else {
            for (let cell of cells) {
                searcher(cell);
            }
        }

        const detailRow = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
        if (rowMatches || searchTerm === '') {
            row.style.display = '';
            if (detailRow) {
                detailRow.style.visibility = 'visible';
            }
            visibleRows++;
        } else {
            row.style.display = 'none';
            if (detailRow) {
                detailRow.style.display = 'none';
            }
        }
    });

    if (visibleRows === 0 && searchTerm !== '') {
        employeeRows.forEach(row => {
            row.style.display = 'none';
        });

        document.getElementById("no-results-div").style.display = 'block';
    } else {
        document.getElementById("no-results-div").style.display = 'none';
    }
}

document.getElementById("table-search").addEventListener('input', searchTable);
document.getElementById("table-search").addEventListener('keyup', searchTable);