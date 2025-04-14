// Utility Functions
function fetchJSON(path) {
    return fetch(path).then(response => response.json());
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDuration(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

function getIcon(hour) {
    return (hour >= 6 && hour < 18) ? '☀️' : '🌙';
}

// Populate Calendar
function populateCalendar() {
    const container = document.getElementById('calendar');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const months = [currentMonth - 1, currentMonth, currentMonth + 1];
    container.innerHTML = '';

    months.forEach(monthOffset => {
        const date = new Date(currentYear, monthOffset);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const table = document.createElement('table');
        const caption = document.createElement('caption');
        caption.textContent = `${monthName} ${year}`;
        table.appendChild(caption);

        const header = table.insertRow();
        ['Wk', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            header.appendChild(th);
        });

        let firstDay = new Date(year, date.getMonth(), 1);
        let day = new Date(firstDay);
        day.setDate(day.getDate() - ((day.getDay() + 6) % 7));

        while (day.getMonth() <= date.getMonth() || day.getDay() !== 1) {
            const row = table.insertRow();
            const weekNumber = Math.ceil((((day - new Date(day.getFullYear(), 0, 1)) / 86400000) + new Date(day.getFullYear(), 0, 1).getDay() + 1) / 7);
            const weekCell = row.insertCell();
            weekCell.textContent = weekNumber;

            for (let i = 0; i < 7; i++) {
                const cell = row.insertCell();
                cell.textContent = day.getDate();
                if (day.getMonth() !== date.getMonth()) {
                    cell.style.opacity = '0.3';
                }
                day.setDate(day.getDate() + 1);
            }
        }

        container.appendChild(table);
    });
}

// Populate Clocks
function populateClocks(cities) {
    const container = document.getElementById('clocks');
    container.innerHTML = '';

    cities.forEach(city => {
        const div = document.createElement('div');
        div.className = 'clock';
        div.style.backgroundImage = `url('./flags/${city.image}')`;

        div.innerHTML = `
            <h2>${city.name.toUpperCase()}</h2>
            <div class="time">Loading...</div>
            <div class="details">
                Sunrise: N/A<br>
                Sunset: N/A<br>
                Day length: N/A
            </div>
        `;

        container.appendChild(div);

        setInterval(() => {
            const now = new Date();
            const localTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
            div.querySelector('.time').textContent = formatTime(localTime);
        }, 1000);
    });
}

// Populate Timezone Table
function populateTimezoneComparison(cities) {
    const container = document.getElementById('timezone');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'timezone-table';

    const headerRow = table.insertRow();
    const firstCell = headerRow.insertCell();
    firstCell.textContent = '';

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    for (let hour = 0; hour < 24; hour++) {
        const cell = headerRow.insertCell();
        const displayHour = (hour === 0) ? '0:00' : `${hour}:00`;
        cell.textContent = displayHour;
    }

    cities.forEach(city => {
        const row = table.insertRow();
        const labelCell = row.insertCell();
        labelCell.textContent = city.name;

        const now = new Date();
        const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
        const cityHour = cityTime.getHours();

        for (let hour = 0; hour < 24; hour++) {
            const cell = row.insertCell();
            const hourOffset = (hour + cityHour + 24) % 24;
            cell.textContent = `${getIcon(hourOffset)} ${hourOffset}:00`;

            if (hour === currentHour) {
                cell.classList.add('current-hour');
            }
        }
    });

    container.appendChild(table);
}

// Populate Important Dates
function populateImportantDates(dates) {
    const container = document.getElementById('important-dates');
    container.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    ['Date', 'Special Occasion', 'Notes'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    dates.forEach(event => {
        const row = table.insertRow();
        row.insertCell().textContent = event.date;
        row.insertCell().textContent = event.occasion;
        row.insertCell().textContent = event.notes;
    });

    container.appendChild(table);
}

// Init
Promise.all([fetchJSON('./data/cities.json'), fetchJSON('./data/important-dates.json')])
    .then(([cities, importantDates]) => {
        populateCalendar();
        populateClocks(cities);
        populateTimezoneComparison(cities);
        populateImportantDates(importantDates);
    })
    .catch(error => console.error('Error loading data:', error));
