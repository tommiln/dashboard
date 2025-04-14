// Utility to fetch JSON files
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

// Display clocks
function displayClocks(cities) {
  const container = document.getElementById('clocks');
  container.innerHTML = '';
  cities.forEach(city => {
    const clock = document.createElement('div');
    clock.className = 'clock';
    clock.style.setProperty('--flag', `url('flags/${city.flag}')`);
    clock.innerHTML = `
      <h2>${city.name.toUpperCase()}</h2>
      <div class="time">Loading...</div>
      <p>Sunrise: N/A</p>
      <p>Sunset: N/A</p>
      <p>Day length: N/A</p>
    `;
    container.appendChild(clock);

    updateClock(city, clock);
    setInterval(() => updateClock(city, clock), 60000); // Update every minute
  });
}

// Update individual clock
function updateClock(city, element) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: city.timezone,
    hour12: true
  });
  element.querySelector('.time').textContent = time;

  // Placeholder sunrise/sunset until API integration
  element.querySelector('p:nth-child(3)').textContent = "Sunrise: 6:00 AM";
  element.querySelector('p:nth-child(4)').textContent = "Sunset: 6:00 PM";
  element.querySelector('p:nth-child(5)').textContent = "Day length: 12h 0m";
}

// Display important dates
function displayImportantDates(dates) {
  const container = document.getElementById('important-dates');
  let html = '<h2>Important Dates</h2><table><tr><th>Date</th><th>Special Occasion</th><th>Notes</th></tr>';
  dates.forEach(item => {
    html += `<tr><td>${item.date}</td><td>${item.occasion}</td><td>${item.notes}</td></tr>`;
  });
  html += '</table>';
  container.innerHTML = html;
}

// Display placeholders for calendar, timezone, and holidays
function displayPlaceholders() {
  document.getElementById('calendar').innerHTML = '<p>Calendar will go here.</p>';
  document.getElementById('timezone').innerHTML = '<p>Timezone comparison tool will go here.</p>';
  document.getElementById('holidays').innerHTML = '<p>Bank holidays will go here.</p>';
}

// Initialize
async function init() {
  try {
    const cities = await loadJSON('data/cities.json');
    const importantDates = await loadJSON('data/important-dates.json');

    displayClocks(cities);
    displayImportantDates(importantDates);
    displayPlaceholders();

  } catch (error) {
    console.error('Error loading data:', error);
  }
}

init();
