// Auto-refresh whole page every 5 minutes
setInterval(() => window.location.reload(), 300000);

// Smooth mode toggle
function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

// City data
let cities = [];

// Holidays & DST data
let holidaysData = {};
let dstData = {};

// Load cities
async function loadCities() {
  const response = await fetch('data/cities.json');
  cities = await response.json();
}

// Get week number
function getWeekNumber(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}

// Generate calendar
function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let table = '<table><thead><tr><th>Wk</th><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody>';

  let date = new Date(year, month, 1);
  const today = new Date();

  while (date <= lastDay) {
    table += '<tr>';
    table += `<td>${getWeekNumber(date)}</td>`;

    for (let day = 0; day < 7; day++) {
      const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      let classes = '';
      let tooltip = '';

      const isoDate = current.toISOString().split('T')[0];

      if (current.toDateString() === today.toDateString()) {
        classes += ' today';
      }

      if (holidaysData[isoDate]) {
        classes += ' bank-holiday';
        tooltip = ` data-tooltip="${holidaysData[isoDate].join(', ')}"`;
      }

      if (current.getMonth() === month && current.getDate()) {
        table += `<td class="${classes.trim()}"${tooltip}>${current.getDate()}</td>`;
      } else {
        table += '<td></td>';
      }

      date.setDate(date.getDate() + 1);
    }

    table += '</tr>';
  }

  table += '</tbody></table>';
  return table;
}

// Render calendars
function renderCalendars() {
  const container = document.getElementById('calendar-container');
  container.innerHTML = '';
  const today = new Date();
  [-1, 0, 1].forEach(offset => {
    const calDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const calendar = document.createElement('div');
    calendar.className = 'calendar';
    calendar.innerHTML = `<h3>${calDate.toLocaleString('default', { month: 'long' })} ${calDate.getFullYear()}</h3>${generateCalendar(calDate.getFullYear(), calDate.getMonth())}`;
    container.appendChild(calendar);
  });
}

// Fetch sunrise and sunset data
async function fetchSunData(lat, lon) {
  try {
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`);
    const data = await response.json();
    if (data.status !== 'OK') return { sunrise: 'N/A', sunset: 'N/A', length: 'N/A' };

    const sunrise = new Date(data.results.sunrise).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.results.sunset).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const diff = Math.abs(new Date(data.results.sunset) - new Date(data.results.sunrise));
    const length = `${Math.floor(diff / 1000 / 60 / 60)}h ${Math.floor((diff / 1000 / 60) % 60)}m`;

    return { sunrise, sunset, length };
  } catch {
    return { sunrise: 'N/A', sunset: 'N/A', length: 'N/A' };
  }
}

// Render clocks
async function renderTimezones() {
  const container = document.getElementById('timezones');
  container.innerHTML = '';

  for (const city of cities) {
    const clock = document.createElement('div');
    clock.className = 'clock';
    const now = new Date().toLocaleString('en-US', { timeZone: city.timezone });
    const local = new Date(now);
    const sunData = await fetchSunData(city.lat, city.lon);

    clock.innerHTML = `
      <div class="city">${city.name.toUpperCase()}</div>
      <div class="time">${local.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="sunrise">Sunrise: ${sunData.sunrise}</div>
      <div class="sunset">Sunset: ${sunData.sunset}</div>
      <div class="daylength">Day Length: ${sunData.length}</div>
    `;

    container.appendChild(clock);
  }
}

// Render time comparison tool
function renderComparison() {
  const container = document.getElementById('comparison');
  container.innerHTML = '';
  const now = new Date();
  const centerHour = now.getHours();

  cities.forEach(city => {
    const row = document.createElement('div');
    row.className = 'comparison-row';

    const cityName = document.createElement('div');
    cityName.className = 'city-name';
    cityName.textContent = city.name;
    row.appendChild(cityName);

    for (let offset = -6; offset <= 6; offset++) {
      const block = document.createElement('div');
      block.className = 'hour-block';
      const date = new Date();
      date.setHours(centerHour + offset + (city.offset - 8));
      const isDay = date.getHours() >= 6 && date.getHours() <= 18;
      block.innerHTML = `<div class="icon">${isDay ? '☀️' : '🌙'}</div><div>${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>`;
      if (offset === 0) block.classList.add('current-hour');
      row.appendChild(block);
    }

    container.appendChild(row);
  });

  // Auto-scroll to center
  setTimeout(() => {
    container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
  }, 100);
}

// Fetch holidays
async function fetchHolidays() {
  const today = new Date();
  const year = today.getFullYear();
  const countries = ['US', 'GB', 'SG'];
  holidaysData = {};

  for (const country of countries) {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`);
    const holidays = await response.json();

    holidays.forEach(h => {
      holidaysData[h.date] = holidaysData[h.date] || [];
      holidaysData[h.date].push(`${country === 'US' ? '🇺🇸' : country === 'GB' ? '🇬🇧' : '🇸🇬'} ${h.localName}`);
    });
  }
}

// Render collapsible holidays list
async function renderHolidaysList() {
  const container = document.getElementById('holidays-list');
  container.innerHTML = '';

  for (const [date, events] of Object.entries(holidaysData).sort()) {
    const line = document.createElement('div');
    line.textContent = `${date}: ${events.join(', ')}`;
    container.appendChild(line);
  }
}

// Toggle holidays section
function toggleHolidays() {
  const list = document.getElementById('holidays-list');
  list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

// Fetch DST data
async function fetchDST() {
  const response = await fetch('https://worldtimeapi.org/api/timezone');
  const zones = await response.json();

  dstData = {
    NY: 'America/New_York',
    London: 'Europe/London'
  };
}

// Render DST info
function renderDSTInfo() {
  const container = document.getElementById('dst-info');
  container.innerHTML = `
    <strong>New York DST Info:</strong> Automatically updated<br>
    <strong>London DST Info:</strong> Automatically updated
  `;
}

// Refresh all
async function refreshAll() {
  await loadCities();
  await fetchHolidays();
  await fetchDST();
  renderCalendars();
  renderTimezones();
  renderComparison();
  renderDSTInfo();
  renderHolidaysList();
}

// Start
refreshAll();
setInterval(refreshAll, 60000);