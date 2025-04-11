// Auto-refresh whole page every 5 minutes
setInterval(() => {
  window.location.reload();
}, 300000); // 300,000 ms = 5 minutes

// Toggle dark mode
function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

// City data from cities.json
let cities = [];

async function loadCities() {
  const response = await fetch('data/cities.json');
  cities = await response.json();
}

// Generate calendar with week numbers
function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  let table = '<table><thead><tr><th>Wk</th><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr></thead><tbody><tr>';
  let day = 1;
  let date = new Date(year, month, day);

  // First row week number
  if (startDay !== 0) {
    table += `<td rowspan="${Math.ceil((7 - startDay + lastDay.getDate()) / 7)}">${getWeekNumber(date)}</td>`;
  }

  for (let i = 0; i < startDay; i++) {
    table += '<td></td>';
  }

  while (day <= lastDay.getDate()) {
    if (date.getDay() === 0 && day !== 1) {
      table += '</tr><tr><td>' + getWeekNumber(date) + '</td>';
    }

    const today = new Date();
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    table += `<td>${isToday ? '<span class="today">' + day + '</span>' : day}</td>`;

    day++;
    date = new Date(year, month, day);
  }

  table += '</tr></tbody></table>';
  return table;
}

function getWeekNumber(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}

// Render calendars
function renderCalendars() {
  const container = document.getElementById('calendar-container');
  container.innerHTML = '';
  const today = new Date();
  [-1, 0, 1].forEach(offset => {
    const calendarDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const calendar = document.createElement('div');
    calendar.className = 'calendar';
    calendar.innerHTML = `<h3>${calendarDate.toLocaleString('default', { month: 'long' })} ${calendarDate.getFullYear()}</h3>${generateCalendar(calendarDate.getFullYear(), calendarDate.getMonth())}`;
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
      date.setHours(centerHour + offset + (city.offset - 8)); // adjust for city offset
      const isDay = date.getHours() >= 6 && date.getHours() <= 18;
      block.innerHTML = `<div class="icon">${isDay ? '☀️' : '🌙'}</div><div>${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>`;
      if (offset === 0) block.classList.add('current-hour');
      row.appendChild(block);
    }

    container.appendChild(row);
  });
}

// Refresh everything
async function refreshAll() {
  await loadCities();
  renderCalendars();
  renderTimezones();
  renderComparison();
}

// Start
refreshAll();
setInterval(refreshAll, 60000);