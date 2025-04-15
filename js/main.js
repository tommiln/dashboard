// Utility Functions
function fetchJSON(path) {
  return fetch(path).then(res => res.json());
}

function formatTime(date) {
  return date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getIcon(hour) {
  return (hour >= 6 && hour < 18) ? '☀️' : '🌙';
}

// Calendar
function buildCalendar(monthOffset = 0) {
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth() + monthOffset);
  const month = current.getMonth();
  const year = current.getFullYear();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const table = document.createElement('table');
  const caption = document.createElement('caption');
  caption.textContent = `${start.toLocaleString('default', { month: 'long' })} ${year}`;
  table.appendChild(caption);

  const head = table.insertRow();
  ['Wk', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
    const th = document.createElement('th');
    th.textContent = day;
    head.appendChild(th);
  });

  let day = new Date(start);
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));

  while (day <= end || day.getDay() !== 1) {
    const row = table.insertRow();
    const weekNum = Math.ceil((((day - new Date(year, 0, 1)) / 86400000) + 1) / 7);
    const weekCell = row.insertCell();
    weekCell.classList.add('week-number');
    weekCell.textContent = weekNum;

    for (let i = 0; i < 7; i++) {
      const cell = row.insertCell();
      cell.textContent = day.getDate();
      if (day.getMonth() !== month) cell.classList.add('inactive');
      if (day.toDateString() === new Date().toDateString()) cell.classList.add('today');
      day.setDate(day.getDate() + 1);
    }
  }
  return table;
}

// Clocks
function buildClocks(cities) {
  const container = document.getElementById('clocks');
  container.innerHTML = '';
  cities.forEach(city => {
    const div = document.createElement('div');
    div.className = 'clock';
    div.style.backgroundImage = `url(./flags/${city.image})`;
    const h2 = document.createElement('h2');
    h2.textContent = city.name.toUpperCase();
    const time = document.createElement('div');
    time.className = 'time';
    const details = document.createElement('div');
    details.className = 'details';
    div.append(h2, time, details);
    container.appendChild(div);

    const updateClock = () => {
      const now = new Date();
      const local = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
      time.textContent = formatTime(local);
      const sunrise = new Date(city.sunrise);
      const sunset = new Date(city.sunset);
      const duration = new Date(sunset - sunrise);
      details.innerHTML = `Sunrise: ${formatTime(sunrise)}<br>Sunset: ${formatTime(sunset)}<br>Day length: ${formatTime(duration)}`;
    };
    updateClock();
    setInterval(updateClock, 60000);
  });
}

// Timezone Table
function buildTimezones(cities) {
  const container = document.getElementById('timezone');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'timezone-table';
  const head = table.insertRow();
  head.insertCell().textContent = '';

  const hours = Array.from({ length: 13 }, (_, i) => i - 6);
  hours.forEach(offset => {
    const th = document.createElement('th');
    const h = new Date();
    h.setHours(h.getHours() + offset);
    th.textContent = `${h.getHours()}:00`;
    head.appendChild(th);
  });

  cities.forEach(city => {
    const row = table.insertRow();
    row.insertCell().textContent = city.name;
    const now = new Date();
    const base = new Date(now.toLocaleString('en-US', { timeZone: city.timezone }));
    const baseHour = base.getHours();
    hours.forEach(offset => {
      const cell = row.insertCell();
      const hour = (baseHour + offset + 24) % 24;
      cell.textContent = `${getIcon(hour)} ${hour}:00`;
      if (offset === 0) cell.classList.add('current-hour');
    });
  });

  container.appendChild(table);
}

// Important Dates
function buildImportantDates(data) {
  const container = document.getElementById('important-dates');
  container.innerHTML = '';
  const table = document.createElement('table');
  const header = table.insertRow();
  ['Date', 'Special Occasion', 'Notes'].forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    header.appendChild(th);
  });

  data.forEach(entry => {
    const row = table.insertRow();
    row.insertCell().textContent = entry.date;
    row.insertCell().textContent = entry.occasion;
    row.insertCell().textContent = entry.notes;
  });
  container.appendChild(table);
}

Promise.all([
  fetchJSON('data/cities.json'),
  fetchJSON('data/important-dates.json')
]).then(([cities, dates]) => {
  const calWrap = document.getElementById('calendar');
  [-1, 0, 1].forEach(m => calWrap.appendChild(buildCalendar(m)));
  buildClocks(cities);
  buildTimezones(cities);
  buildImportantDates(dates);
});
