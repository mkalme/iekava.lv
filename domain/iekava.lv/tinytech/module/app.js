// I tried to make the system modular where each component (module) and all their behaviours are in one imported file. 
import './language/language.js';
import { FloatingWindow, setFont, applyTheme } from './style.js';
import { employeesReady } from './api/api.js';
import './filter.js';
import './sort.js';
import './search.js';

var accessibilityWindow = new FloatingWindow(
    document,
    document.getElementById('accessibility-button'),
    document.getElementById('accessibility-window')
);

document.querySelectorAll('.font-size-buttons .font-size-button').forEach(button => {
    button.addEventListener('click', function() {
        setFont(this.value);
        accessibilityWindow.closeFloatingWindow();
    });
});

document.querySelectorAll('.contrast-buttons .contrast-button').forEach(button => {
    button.addEventListener('click', function() {
        applyTheme(this.value);
        accessibilityWindow.closeFloatingWindow();
    });
});


employeesReady.then(employees => {
    var table = document.getElementById("employee-table");
    employees.forEach(employee => {
        addEmployeeToTable(employee, table);
    });
});

function addEmployeeToTable(employee, table) {
    const row = document.createElement('tr');
    row.setAttribute('employee-id', employee.id);
    row.className = 'employee-row';
    row.style.cursor = 'pointer';

    row.innerHTML = `
        <td>${employee.id}</td>
        <td>${employee.getFirstName()}</td>
        <td>${employee.getLastName()}</td>
        <td>${employee.startDate.toLocaleDateString()}</td>
        <td>${employee.title}</td>
        <td>${employee.email}</td>
    `;

    // Detail row (initially hidden)
    const detailRow = document.createElement('tr');
    detailRow.className = 'detail-row';
    detailRow.style.display = 'none';
    detailRow.setAttribute('data-employee-id', employee.id);

    detailRow.innerHTML = `
        <td colspan="6" class="detail-row">
            <div>
                <h4 language-code="home.table.data.additional-information">Additional Information</h4>
                <h4 style="display: inline;" language-code="home.table.data.department">Department: </h4>
                <p style="display: inline;">${employee.department || 'N/A'}</p></br>
                <h4 style="display: inline;" language-code="home.table.data.phone">Phone: </h4>
                <p style="display: inline;">${employee.phone || 'N/A'}</p></br>
                <h4 style="display: inline;" language-code="home.table.data.hourly-pay">Hourly pay: </h4>
                <p style="display: inline;">${employee.hourlyPay || 'N/A'}</p>
            </div>
        </td>
    `;

    // Click event to toggle detail row
    row.addEventListener('click', function() {
        if (detailRow.style.display === 'none') {
            detailRow.style.display = 'table-row';
        } else {
            detailRow.style.display = 'none';
        }
    });

    table.appendChild(row);
    table.appendChild(detailRow);
}