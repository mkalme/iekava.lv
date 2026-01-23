// In a real world scenario this module should be called EmployeeAPI or something similar and contains async get methods that call the API itself and return the results. Preferably with some authorization protocol like OAuth2 for different roles, e.g. accountants may be allowed to issue payroll, managers may be allowed to add/remove employees and regular employees may be only alloed to see stuff.

class Employee {
    constructor(id, name, title, email, startDate) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.email = email;
        this.startDate = new Date(startDate);
    }

    getFirstName() {
        return this.name.split(' ')[0];
    }

    getLastName() {
        return this.name.split(' ').slice(1).join(' ');
    }
}

class EmployeeParser {
    static async parseFromFile(filePath) {
        const response = await fetch(filePath);
        const json = await response.json();
        return this.parseFromArray(json);
    }

    static parseFromArray(jsonArray) {
        if (!Array.isArray(jsonArray)) {
            throw new Error('Expected an array of employee objects');
        }

        return jsonArray.map((employeeData, index) => {
            try {
                return this.createEmployee(employeeData);
            } catch (error) {
                throw new Error(`Error parsing employee at index ${index}: ${error.message}`);
            }
        });
    }

    static createEmployee(employeeData) {
        // Validate required fields
        const requiredFields = ['id', 'name', 'title', 'email', 'startDate'];
        for (const field of requiredFields) {
            if (!(field in employeeData)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        var output = new Employee (
            employeeData.id,
            employeeData.name,
            employeeData.title,
            employeeData.email,
            employeeData.startDate
        );

        output.phone = employeeData.phone;
        output.hourlyPay = employeeData.hourlyPay;
        output.department = employeeData.department;

        return output;
    }
}

const employeesReady = EmployeeParser.parseFromFile("./module/api/employees.json");
export { Employee, EmployeeParser, employeesReady };