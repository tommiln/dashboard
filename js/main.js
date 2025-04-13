// Toggle mode between light and dark
function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

// Auto-refresh page daily for sunrise/sunset updates
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    location.reload();
  }
}, 60000); // Check every minute

// Utility functions
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function fetchJSON(url) {
  return fetch(url).then(response => response.json());
}

// Load cities data and build clocks
async function loadClocks() {
  const cities = await fetchJSON('data/cities.json');
  const timezones = document.getElementById('timezones');
  timezones.innerHTML = '';

  cities.forEach(async city => {
    const cityDiv = document.createElement('div');
    cityDiv.className = 'clock';

    const cityName = document.createElement('div');
    cityName.className = 'city';
    cityName.textContent = city.name.toUpperCase();
    cityDiv.appendChild(cityName);

    const timeEl = document.createElement('div');
    timeEl.className = 'time';
    cityDiv.appendChild(timeEl);

    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    cityDiv.appendChild(dateEl);

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
      const locale = 'en-US';
      const cityTime = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
      timeEl.textContent = formatTime(cityTime);
      dateEl.textContent = formatDate(cityTime);

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
    setInterval(updateClock, 60000); // update every minute
  });
}

// Build calendar
function buildCalendar() {
  const container = document.getElementById('calendar-container');
  container.innerHTML = '';

  const months = [-1, 0, 1]; // Previous, current, next month
  const today = new Date();

  months.forEach(offset => {
    const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const div = document.createElement('div');
    div.className = 'calendar';

    const table = document.createElement('table');

    const header = document.createElement('thead');
    header.innerHTML = `<tr><th colspan="7">${monthName} ${year}</th></tr><tr>${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<th>${d}</th>`).join('')}</tr>`;
    table.appendChild(header);

    const body = document.createElement('tbody');
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) {
      row.appendChild(document.createElement('td'));
    }

    for (let day = 1; day <= lastDate; day++) {
      if (row.children.length === 7) {
        body.appendChild(row);
        row = document.createElement('tr');
      }

      const cell = document.createElement('td');
      const dateCheck = new Date(date.getFullYear(), date.getMonth(), day);

      if (dateCheck.toDateString() === today.toDateString()) {
        cell.innerHTML = `<span class="today">${day}</span>`;
      } else {
        cell.textContent = day;
      }

      row.appendChild(cell);
    }

    if (row.children.length > 0) {
      while (row.children.length < 7) {
        row.appendChild(document.createElement('td'));
      }
      body.appendChild(row);
    }

    table.appendChild(body);
    div.appendChild(table);
    container.appendChild(div);
  });
}

// Build time comparison tool
async function buildComparison() {
  const container = document.getElementById('comparison');
  container.innerHTML = '';

  const cities = await fetchJSON('data/cities.json');
  const now = new Date();

  const comparisonRows = cities.map(city => {
    const row = document.createElement('div');
    row.className = 'comparison-row';

    const cityName = document.createElement('div');
    cityName.className = 'city-name';
    cityName.textContent = city.name;
    row.appendChild(cityName);

    const currentHour = new Date(now.toLocaleString('en-US', { timeZone: city.timezone })).getHours();
    for (let i = -6; i <= 6; i++) {
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

// Toggle holidays display
function toggleHolidays() {
  const holidaysList = document.getElementById('holidays-list');
  holidaysList.style.display = holidaysList.style.display === 'none' ? 'block' : 'none';
}

// Initialize dashboard
function initializeDashboard() {
  buildCalendar();
  loadClocks();
  buildComparison();
}

initializeDashboard();
setInterval(initializeDashboard, 60000); // Refresh every minute