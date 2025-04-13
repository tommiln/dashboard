// ========== CONFIG ==========
const cities = [
  { name: "New York", timezone: "America/New_York", flag: "us.png" },
  { name: "London", timezone: "Europe/London", flag: "uk.png" },
  { name: "Brussels", timezone: "Europe/Brussels", flag: "brussels.png" },
  { name: "Helsinki", timezone: "Europe/Helsinki", flag: "finland.png" },
  { name: "Singapore", timezone: "Asia/Singapore", flag: "singapore.png" }
];

// ========== UTILS ==========
function fetchJSON(path) {
  return fetch(path).then(response => response.json());
}

function formatTime(date, timeZone) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// ========== CLOCKS ==========
function updateClocks() {
  const now = new Date();
  cities.forEach(city => {
    const timeElement = document.querySelector(`#clocks .clock-card[data-city="${city.name}"] .city-time`);
    if (timeElement) timeElement.textContent = formatTime(now, city.timezone);
  });
}

// ========== CALENDAR ==========
function generateCalendar(year, month, holidays) {
  const calendarContainer = document.getElementById('calendar');
  calendarContainer.innerHTML = ''; // Clear

  const firstDay = new Date(year, month, 1);
  const monthName = firstDay.toLocaleDateString('en-GB', { month: 'long' });
  const title = document.createElement('h2');
  title.style.color = '#e53935';
  title.textContent = `${monthName} ${year}`;
  calendarContainer.appendChild(title);

  const table = document.createElement('table');
  const headerRow = table.insertRow();
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  weekdays.forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    headerRow.appendChild(th);
  });

  const date = new Date(year, month, 1);
  const startDay = (date.getDay() + 6) % 7; // Make Monday first
  let currentRow = table.insertRow();

  if (startDay !== 0) {
    for (let i = 0; i < startDay; i++) {
      currentRow.insertCell();
    }
  }

  while (date.getMonth() === month) {
    if (currentRow.cells.length === 7) {
      currentRow = table.insertRow();
    }

    const cell = currentRow.insertCell();
    cell.textContent = date.getDate();

    const fullDate = formatDate(date);
    const holiday = holidays.find(h => h.date === fullDate);

    if (holiday) {
      cell.classList.add('holiday-highlight');
      cell.title = `${holiday.name} (${holiday.country})`;
    }

    date.setDate(date.getDate() + 1);
  }

  calendarContainer.appendChild(table);
}

// ========== HOLIDAYS ==========
function renderHolidays(holidays) {
  const container = document.getElementById('holidays');
  container.innerHTML = '<h3>Bank Holidays (US 🇺🇸, UK 🇬🇧, Singapore 🇸🇬)</h3><table><tr><th>Date</th><th>Holiday</th><th>Country</th></tr>';

  holidays.forEach(event => {
    container.innerHTML += `<tr><td>${event.date}</td><td>${event.name}</td><td>${event.country}</td></tr>`;
  });

  container.innerHTML += '</table>';
}

// ========== IMPORTANT DATES ==========
function renderImportantDates(dates) {
  const container = document.getElementById('important-dates');
  container.innerHTML = '<h3>Important Dates</h3><table><tr><th>Date</th><th>Special Occasion</th><th>Notes</th></tr>';

  dates.forEach(event => {
    container.innerHTML += `<tr><td>${event.date}</td><td>${event.occasion}</td><td>${event.notes}</td></tr>`;
  });

  container.innerHTML += '</table>';
}

// ========== CLOCK CARDS ==========
function renderClocks() {
  const container = document.getElementById('clocks');
  container.innerHTML = '';

  cities.forEach(city => {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.setAttribute('data-city', city.name);

    card.innerHTML = `
      <div class="city-flag" style="background-image: url('flags/${city.flag}');"></div>
      <div class="city-name">${city.name.toUpperCase()}</div>
      <div class="city-time">Loading...</div>
      <div class="city-sun">Sunrise: N/A<br>Sunset: N/A<br>Day length: N/A</div>
    `;

    container.appendChild(card);
  });
}

// ========== INITIALIZE ==========
async function initialize() {
  const [importantDates, holidaysRaw] = await Promise.all([
    fetchJSON('important-dates.json'),
    loadHolidays()
  ]);

  const holidays = holidaysRaw.flatMap(country =>
    country.holidays.map(h => ({
      date: h.date,
      name: h.name,
      country: country.country
    }))
  );

  renderClocks();
  updateClocks();
  generateCalendar(new Date().getFullYear(), new Date().getMonth(), holidays);
  renderHolidays(holidays);
  renderImportantDates(importantDates);

  setInterval(updateClocks, 60000);
}

// ========== DYNAMIC HOLIDAY LOADING ==========
async function loadHolidays() {
  return [
    {
      country: 'United States',
      holidays: [
        { date: '1 January 2025', name: "New Year's Day" },
        { date: '20 January 2025', name: "Martin Luther King Jr. Day" },
        { date: '17 February 2025', name: "Washington's Birthday" },
        { date: '26 May 2025', name: "Memorial Day" },
        { date: '4 July 2025', name: "Independence Day" },
        { date: '1 September 2025', name: "Labor Day" },
        { date: '13 October 2025', name: "Columbus Day" },
        { date: '11 November 2025', name: "Veterans Day" },
        { date: '27 November 2025', name: "Thanksgiving Day" },
        { date: '25 December 2025', name: "Christmas Day" }
      ]
    },
    {
      country: 'United Kingdom',
      holidays: [
        { date: '1 January 2025', name: "New Year's Day" },
        { date: '18 April 2025', name: "Good Friday" },
        { date: '21 April 2025', name: "Easter Monday" },
        { date: '5 May 2025', name: "Early May Bank Holiday" },
        { date: '25 August 2025', name: "Summer Bank Holiday" },
        { date: '25 December 2025', name: "Christmas Day" },
        { date: '26 December 2025', name: "Boxing Day" }
      ]
    },
    {
      country: 'Singapore',
      holidays: [
        { date: '1 January 2025', name: "New Year's Day" },
        { date: '29 January 2025', name: "Chinese New Year" },
        { date: '30 January 2025', name: "Chinese New Year (Day 2)" },
        { date: '18 April 2025', name: "Good Friday" },
        { date: '1 May 2025', name: "Labour Day" },
        { date: '12 May 2025', name: "Vesak Day" },
        { date: '9 August 2025', name: "National Day" },
        { date: '21 October 2025', name: "Deepavali" },
        { date: '25 December 2025', name: "Christmas Day" }
      ]
    }
  ];
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', initialize);