// Load JSON data
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

// Display clock info
function displayClocks(cities) {
  const container = document.getElementById('clocks');
  container.innerHTML = '';
  cities.forEach(city => {
    const clock = document.createElement('div');
    clock.className = 'clock';
    clock.style.setProperty('--flag', `url('../flags/${city.flag}')`);
    clock.querySelector = '.clock::before { background-image: url("flags/' + city.flag + '"); }';
    clock.innerHTML = `
      <h2>${city.name.toUpperCase()}</h2>
      <div class="time">Loading...</div>
      <p>Sunrise: N/A</p>
      <p>Sunset: N/A</p>
      <p>Day length: N/A</p>
    `;
    container.appendChild(clock);
  });
}

// Initial load
async function init() {
  try {
    const cities = await loadJSON('data/cities.json');
    const importantDates = await loadJSON('data/important-dates.json');

    displayClocks(cities);

    // You can continue to implement timezone comparison, calendar, etc. functions here...

  } catch (error) {
    console.error('Error loading data:', error);
  }
}

init();
