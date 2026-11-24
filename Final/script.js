const wageInput = document.getElementById('wageInput');
const targetMonthInput = document.getElementById('targetMonth');
const searchBtn = document.getElementById('searchBtn');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarTitle = document.getElementById('calendarTitle');
const daysGrid = document.getElementById('daysGrid');
const dayRuleInputs = document.querySelectorAll('.day-rule-input');

const totalHoursEl = document.getElementById('totalHours');
const basePayEl = document.getElementById('basePay');
const holidayPayEl = document.getElementById('holidayPay');
const totalPayEl = document.getElementById('totalPay');

let currentDate = new Date(2026, 10, 1);
let dayOverrides = {};

searchBtn.addEventListener('click', () => {
    const [year, month] = targetMonthInput.value.split('-').map(Number);
    if (year && month) {
        currentDate = new Date(year, month - 1, 1);
        dayOverrides = {};
        renderCalendar();
    }
});

prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

function changeMonth(diff) {
    currentDate.setMonth(currentDate.getMonth() + diff);
    syncMonthInput();
    dayOverrides = {};
    renderCalendar();
}

function syncMonthInput() {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    targetMonthInput.value = `${year}-${month}`;
}

function getDefaultDayHours() {
    const rules = {};
    dayRuleInputs.forEach((input) => {
        rules[Number(input.dataset.day)] = Number(input.value) || 0;
    });
    return rules;
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); 
    const lastDate = new Date(year, month + 1, 0).getDate(); 
    const prevLastDate = new Date(year, month, 0).getDate();
    const defaultRules = getDefaultDayHours();

    calendarTitle.textContent = `${year}년 ${month + 1}월`;
    daysGrid.innerHTML = '';

    for (let i = firstDay; i > 0; i--) {
        daysGrid.appendChild(createOtherMonthCell(prevLastDate - i + 1));
    }


    for (let day = 1; day <= lastDate; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month, day).getDay();
        const defaultHours = defaultRules[dayOfWeek] || 0;

        if (!dayOverrides[dateKey]) {
            dayOverrides[dateKey] = {
                active: defaultHours > 0,
                hours: defaultHours
            };
        }

        daysGrid.appendChild(createDayCell(day, dateKey, dayOverrides[dateKey]));
    }

    calculateSalary();
}


syncMonthInput();
renderCalendar();