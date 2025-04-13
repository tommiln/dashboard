// Toggle light/dark mode
function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

// Smooth auto-refresh daily for sunrise/sunset and holidays
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    location.reload();
  }
}, 60000); // Check every minute

// Utility functions
function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}

function fetchJSON(url) {
  return fetch(url).then(response => response.json());
}

// Holidays storage
let holidays = [];

// Load cities data and build clocks
async function loadClocks() {
  const cities = await fetchJSON('data/cities.json');
  const timezones = document.getElementById('timezones');
  timezones.innerHTML = '';

  cities.forEach(async city => {
    const cityDiv = document.createElement('div');
    cityDiv.className = 'clock';
    cityDiv.style.backgroundImage = `url('flags/${city.flag}')`;

    const cityName = document.createElement('div');
    cityName.className = 'city';
    cityName.textContent = city.name.toUpperCase();
    cityDiv.appendChild(cityName);

    const timeEl = document.createElement('div');
    timeEl.className = 'time';
    cityDiv.appendChild(timeEl);

    const sunriseEl = document.createElement('div');
    sunriseEl.className = 'sunrise';
    cityDiv.appendChild(sunriseEl);

    const sunsetEl = document.createElement('div');
    sunsetEl.className = 'sunset';
    cityDiv.appendChild(sunsetEl);

    const daylengthEl = document.createElement('div');
    daylengthEl.className = 'daylength';
    cityDiv.appendChild(daylengthEl);

    timezones.appendChild(cityDiv);

    async function updateClock() {
      const now = new Date();
      const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
      timeEl.textContent = formatTime(cityTime);

      try {
        const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${city.lat}&lng=${city.lng}&formatted=0`);
        const data = await response.json();

        const sunrise = new Date(data.results.sunrise);
        const sunset = new Date(data.results.sunset);

        sunriseEl.textContent = `Sunrise: ${formatTime(sunrise)}`;
        sunsetEl.textContent = `Sunset: ${formatTime(sunset)}`;

        const dayLengthSeconds = data.results.day_length;
        const hours = Math.floor(dayLengthSeconds / 3600);
        const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
        daylengthEl.textContent = `Day length: ${hours}h ${minutes}m`;
      } catch (e) {
        sunriseEl.textContent = 'Sunrise: N/A';
        sunsetEl.textContent = 'Sunset: N/A';
        daylengthEl.textContent = 'Day length: N/A';
      }
    }

    updateClock();
    setInterval(updateClock, 60000);
  });
}

// Load holidays
async function loadHolidays() {
  const currentYear = new Date().getFullYear();
  const endpoints = [
    { country: 'us', name: 'United States 🇺🇸' },
    { country: 'gb', name: 'United Kingdom 🇬🇧' },
    { country: 'sg', name: 'Singapore 🇸🇬' }
  ];

  holidays = [];

  for (const { country, name } of endpoints) {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/${country}`);
    const data = await response.json();

    data.forEach(holiday => {
      holidays.push({ date: holiday.date, name: holiday.localName, country: name });
    });
  }

  renderHolidays();
  highlightNextHoliday();
}

// Render holidays in bottom section
function renderHolidays() {
  const holidaysList = document.getElementById('holidays-list');
  holidaysList.innerHTML = '';

  const byCountry = {
    'United States 🇺🇸': [],
    'United Kingdom 🇬🇧': [],
    'Singapore 🇸🇬': []
  };

  holidays.forEach(h => {
    byCountry[h.country].push(h);
  });

  for (const country in byCountry) {
    const countryDiv = document.createElement('div');
    byCountry[country].sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(holiday => {
      const holidayEl = document.createElement('div');
      holidayEl.textContent = `${formatDateDisplay(holiday.date)} - ${holiday.name}`;
      countryDiv.appendChild(holidayEl);
    });
    holidaysList.appendChild(countryDiv);
  }
}

// Highlight next upcoming holiday
function highlightNextHoliday() {
  const now = new Date();
  const nextHoliday = holidays.find(h => new Date(h.date) >= now);

  const nextHolidayEl = document.getElementById('next-holiday');
  if (nextHoliday) {
    nextHolidayEl.textContent = `Next Holiday: ${formatDateDisplay(nextHoliday.date)} — ${nextHoliday.name} (${nextHoliday.country})`;
  } else {
    nextHolidayEl.textContent = 'No upcoming holidays';
  }
}

// Build calendar
function buildCalendar() {
  const container = document.getElementById('calendar-container');
  container.innerHTML = '';

  const months = [-1, 0, 1];
  const today = new Date();

  months.forEach(offset => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const div = document.createElement('div');
    div.className = 'calendar';

    const table = document.createElement('table');

    const header = document.createElement('thead');
    header.innerHTML = `<tr><th colspan="8">${monthName} ${year}</th></tr><tr><th>Wk</th>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<th>${d}</th>`).join('')}</tr>`;
    table.appendChild(header);

    const body = document.createElement('tbody');

    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    let dayCounter = 1;
    let startOffset = (firstDay.getDay() + 6) % 7;

    while (dayCounter <= lastDate) {
      const row = document.createElement('tr');

      const weekNumber = getWeekNumber(new Date(date.getFullYear(), date.getMonth(), dayCounter));
      const weekCell = document.createElement('td');
      weekCell.textContent = weekNumber;
      weekCell.style.opacity = '0.5';
      row.appendChild(weekCell);

      for (let i = 0; i < 7; i++) {
        const cell = document.createElement('td');
        const cellDate = new Date(date.getFullYear(), date.getMonth(), dayCounter);

        if ((dayCounter === 1 && i >= startOffset) || (dayCounter > 1 && dayCounter <= lastDate)) {
          const holiday = holidays.find(h => h.date === cellDate.toISOString().split('T')[0]);
          if (cellDate.toDateString() === today.toDateString()) {
            cell.innerHTML = `<span class="today">${dayCounter}</span>`;
          } else if (holiday) {
            cell.innerHTML = `<div class="tooltip bold-holiday">${dayCounter}<span class="tooltiptext">${holiday.name} (${holiday.country})</span></div>`;
          } else {
            cell.textContent = dayCounter;
          }
          dayCounter++;
        }

        row.appendChild(cell);
      }

      body.appendChild(row);
    }

    table.appendChild(body);
    div.appendChild(table);
    container.appendChild(div);
  });
}

// Get ISO week number
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Build time comparison tool
async function buildComparison() {
  const container = document.getElementById('comparison');
  container.innerHTML = '';

  const cities = await fetchJSON('data/cities.json');
  const now = new Date();

  cities.forEach(city => {
    const row = document.createElement('div');
    row.className = 'comparison-row';

    const cityName = document.createElement('div');
    cityName.className = 'city-name';
    cityName.textContent = city.name;
    row.appendChild(cityName);

    const currentHour = new Date(now.toLocaleString('en-US', { timeZone: city.timezone })).getHours();
    for (let i = -8; i <= 8; i++) {
      const block = document.createElement('div');
      block.className = 'hour-block';
      const blockHour = (currentHour + i + 24) % 24;
      block.innerHTML = `<div class="icon">${blockHour >= 6 && blockHour < 18 ? '☀️' : '🌙'}</div>${blockHour}:00`;
      if (i === 0) block.classList.add('current-hour');
      row.appendChild(block);
    }

    container.appendChild(row);
  });
}

// Load Important Dates
async function loadImportantDates() {
  const data = await fetchJSON('data/important-dates.json');
  const tableBody = document.querySelector('#important-dates-table tbody');
  tableBody.innerHTML = '';

  data.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDateDisplay(item.date)}</td>
      <td>${item.name}</td>
      <td><a href="${item.notes}" target="_blank">${item.notes}</a></td>
    `;
    tableBody.appendChild(row);
  });
}

// Initialize dashboard
function initializeDashboard() {
  buildCalendar();
  loadClocks();
  buildComparison();
  loadHolidays();
  loadImportantDates();
}

initializeDashboard();
setInterval(initializeDashboard, 60000);