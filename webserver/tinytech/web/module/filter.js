import { FloatingWindow } from './style.js';
import { employeesReady } from './api/api.js';

class Filter {
    constructor(employees){
        this.firstNameRegex = new RegExp();
        this.lastNameRegex = new RegExp();
        this.joinedFrom = new Date();
        this.joinedTo = new Date();
        this.titles = new Map();
        this.emailRegex = new RegExp();

        if (employees.length > 0) {
            const joinDates = employees.map(employee => new Date(employee.startDate));
            this.joinedFrom = new Date(Math.min(...joinDates));
            this.joinedTo = new Date(Math.max(...joinDates));
        }

        employees.forEach(employee => {
            this.titles.set(employee.title, false);
        });
    }

    filter(employee){
        if (this.firstNameRegex.source !== "(?:)" && !this.firstNameRegex.test(employee.getFirstName())) {
            return false;
        }

        if (this.lastNameRegex.source !== "(?:)" && !this.lastNameRegex.test(employee.getLastName())) {
            return false;
        }

        if (this.emailRegex.source !== "(?:)" && !this.emailRegex.test(employee.email)) {
            return false;
        }

        if (employee.startDate < this.joinedFrom || employee.startDate > this.joinedTo) {
            return false;
        }

        const allTitlesFalse = Array.from(this.titles.values()).every(value => value === false);
        if (!allTitlesFalse && this.titles.size > 0 && !this.titles.get(employee.title)) {
            return false;
        }

        return true;
    }
}

let filter;
let employees;

employeesReady.then(employeesA => {
    filter = new Filter(employeesA);
    employees = employeesA;
});

var filterWindow = new FloatingWindow(
    document,
    document.getElementById('filter-button'),
    document.getElementById('filter-window')
);

var changes = new Map;

filterWindow.addEventListener('beforeOpen', (event) => {
    var div = document.getElementById("filter-title-div");
    div.innerHTML = '';

    document.getElementById("filter-firstName").value = filter.firstNameRegex.source;
    document.getElementById("filter-lastName").value = filter.lastNameRegex.source;
    document.getElementById("filter-email").value = filter.emailRegex.source;
    document.getElementById("filter-from-date").value = filter.joinedFrom.toISOString().split('T')[0];
    document.getElementById("filter-to-date").value = filter.joinedTo.toISOString().split('T')[0];
    
    changes = new Map();
    filter.titles.forEach((selected, title) => {
        var container = document.createElement('label');
        container.className = "checkbox-container";

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'title-filter';
        checkbox.value = title;
        checkbox.id = 'checkbox-' + title.replace(/\s+/g, '-');
        checkbox.checked = selected;

        checkbox.addEventListener('change', function() {
            changes.set(title, checkbox.checked)
        });

        var textSpan = document.createElement('span');
        textSpan.textContent = title;
        textSpan.className = "checkbox-text";

        container.appendChild(checkbox);
        container.appendChild(textSpan);
        div.appendChild(container);
    });
});

document.getElementById("apply-filter-button").addEventListener('click', function() {
    const firstNameValue = document.getElementById("filter-firstName").value;
    const lastNameValue = document.getElementById("filter-lastName").value;
    const emailValue = document.getElementById("filter-email").value;
    
    if (firstNameValue.trim()) {
        filter.firstNameRegex = new RegExp(firstNameValue, 'i');
    } else {
        filter.firstNameRegex = new RegExp();
    }

    if (lastNameValue.trim()) {
        filter.lastNameRegex = new RegExp(lastNameValue, 'i');
    } else {
        filter.lastNameRegex = new RegExp();
    }

    if (emailValue.trim()) {
        filter.emailRegex = new RegExp(emailValue, 'i');
    } else {
        filter.emailRegex = new RegExp();
    }

    const fromDateValue = document.getElementById("filter-from-date").value;
    const toDateValue = document.getElementById("filter-to-date").value;

    if (fromDateValue) {
        filter.joinedFrom = new Date(fromDateValue);
    }
    if (toDateValue) {
        filter.joinedTo = new Date(toDateValue);
    }

    changes.forEach((selected, title) => {
        filter.titles.set(title, selected);
    });

    filterWindow.closeFloatingWindow();
    filterTable(document.getElementById("employee-table"), filter);
});

function filterTable(table, filter) {
    const rows = table.querySelectorAll('.employee-row');
    
    rows.forEach(row => {
        const employeeId = row.getAttribute('employee-id');
        const detailRow = table.querySelector(`[data-employee-id="${employeeId}"]`);
        
        const employee = employees.find(emp => emp.id == employeeId);
        const shouldShow = employee ? filter.filter(employee) : false;
        
        if (shouldShow) {
            row.style.display = 'table-row';
            detailRow.style.display = 'none';
        } else {
            row.style.display = 'none';
            detailRow.style.display = 'none';
        }
    });
}