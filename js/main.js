// ========== Load Data ==========
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

const citiesPath = "data/cities.json";
const datesPath = "data/important-dates.json";

let cities = [];
let importantDates = [];

Promise.all([loadJSON(citiesPath), loadJSON(datesPath)])
  .then(([cityData, dateData]) => {
    cities = cityData;
    importantDates = dateData;
    buildDashboard();
  })
  .catch(console.error);

// ========== Build Dashboard ==========
function buildDashboard() {
  renderCalendar();
  renderClocks();
  renderTimezones();
  renderImportantDates();
}

// ========== Calendar ==========
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  const today = new Date();
  const monthsToShow = [-1, 0, 1];

  monthsToShow.forEach(offset => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    calendar.appendChild(generateMonthCalendar(monthDate, today));
  });
}

function generateMonthCalendar(date, today) {
  const monthDiv = document.createElement("div");
  monthDiv.className = "month";
  const year = date.getFullYear();
  const month = date.getMonth();

  const title = document.createElement("div");
  title.className = "month-title";
  title.innerText = date.toLocaleString("default", { month: "long", year: "numeric" });
  monthDiv.appendChild(title);

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  ["Wk", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(d => {
    const th = document.createElement("th");
    th.innerText = d;
    if (d === "Wk") th.classList.add("faded");
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay() || 7;
  const start = new Date(firstDay);
  start.setDate(start.getDate() - startDay + 1);

  for (let week = 0; week < 6; week++) {
    const tr = document.createElement("tr");

    const weekNumber = getWeekNumber(new Date(start));
    const tdWeek = document.createElement("td");
    tdWeek.className = "faded";
    tdWeek.innerText = weekNumber;
    tr.appendChild(tdWeek);

    for (let d = 0; d < 7; d++) {
      const day = new Date(start);
      const td = document.createElement("td");
      td.innerText = day.getDate();
      if (day.getMonth() !== month) td.className = "faded";
      if (
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear()
      ) {
        td.classList.add("today");
      }
      tr.appendChild(td);
      start.setDate(start.getDate() + 1);
    }
    table.appendChild(tr);
  }

  monthDiv.appendChild(table);
  return monthDiv;
}

function getWeekNumber(date) {
  const temp = new Date(date.getTime());
  temp.setHours(0, 0, 0, 0);
  temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
  const week1 = new Date(temp.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((temp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  );
}

// ========== Clocks ==========
function renderClocks() {
  const container = document.getElementById("clocks");
  container.innerHTML = "";

  cities.forEach(city => {
    const card = document.createElement("div");
    card.className = "clock";
    card.style.backgroundImage = `url(flags/${city.image})`;

    const title = document.createElement("div");
    title.className = "clock-title";
    title.innerText = city.name.toUpperCase();
    card.appendChild(title);

    const time = document.createElement("div");
    time.className = "clock-time";
    time.innerText = getTimeInCity(city.timezone);
    card.appendChild(time);

    const sunrise = document.createElement("div");
    sunrise.innerText = `Sunrise: ${city.sunrise || "N/A"}`;
    card.appendChild(sunrise);

    const sunset = document.createElement("div");
    sunset.innerText = `Sunset: ${city.sunset || "N/A"}`;
    card.appendChild(sunset);

    const length = document.createElement("div");
    length.innerText = `Day length: ${city.dayLength || "N/A"}`;
    card.appendChild(length);

    container.appendChild(card);
  });
}

function getTimeInCity(tz) {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: tz
  });
}

// ========== Timezones ==========
function renderTimezones() {
  const tzDiv = document.getElementById("timezone");
  tzDiv.innerHTML = "";

  const table = document.createElement("table");
  const header = document.createElement("tr");

  const timeSlots = [];
  const now = new Date();
  const base = new Date(now.getTime());
  base.setHours(base.getHours() - 6, 0, 0, 0);

  for (let i = 0; i < 13; i++) {
    const slot = new Date(base.getTime() + i * 60 * 60 * 1000);
    timeSlots.push(slot);
  }

  header.appendChild(document.createElement("th"));
  timeSlots.forEach(slot => {
    const th = document.createElement("th");
    th.innerText = slot.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    if (slot.getHours() === now.getHours()) th.className = "highlight";
    header.appendChild(th);
  });
  table.appendChild(header);

  cities.forEach(city => {
    const tr = document.createElement("tr");
    const label = document.createElement("td");
    label.innerText = city.name;
    tr.appendChild(label);

    timeSlots.forEach(slot => {
      const td = document.createElement("td");
      const localTime = new Date(slot.toLocaleString("en-US", { timeZone: city.timezone }));
      const hour = localTime.getHours();
      const icon = hour >= 6 && hour < 18 ? "☀️" : "🌙";
      td.innerText = `${icon} ${hour}:00`;
      if (slot.getHours() === now.getHours()) td.className = "highlight";
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  tzDiv.appendChild(table);
}

// ========== Important Dates ==========
function renderImportantDates() {
  const table = document.getElementById("important-dates");
  table.innerHTML = "";

  const header = table.insertRow();
  ["Date", "Special Occasion", "Notes"].forEach(h => {
    const th = document.createElement("th");
    th.innerText = h;
    header.appendChild(th);
  });

  importantDates.forEach(item => {
    const row = table.insertRow();
    row.insertCell().innerText = item.date;
    row.insertCell().innerText = item.occasion;
    row.insertCell().innerText = item.notes;
  });
}
