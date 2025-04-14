async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

// Clock data
async function loadClocks() {
  const container = document.querySelector(".clock-container");
  container.innerHTML = "";

  const cities = await fetchData("data/cities.json");

  cities.forEach((city) => {
    const card = document.createElement("div");
    card.className = "clock";

    const title = document.createElement("h3");
    title.textContent = city.name;

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = "Loading...";

    const details = document.createElement("div");
    details.className = "details";
    details.innerHTML = `
      Sunrise: N/A<br>
      Sunset: N/A<br>
      Day length: N/A
    `;

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(details);
    container.appendChild(card);

    function updateClock() {
      const now = new Date();
      const localTime = new Date(now.toLocaleString("en-US", { timeZone: city.timezone }));
      const hours = localTime.getHours();
      const minutes = localTime.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;

      time.textContent = `${displayHours}:${minutes} ${ampm}`;
    }

    updateClock();
    setInterval(updateClock, 60000);
  });
}

// Calendar
function loadCalendar() {
  const container = document.getElementById("calendar");
  container.innerHTML = "";

  const today = new Date();
  const monthsToShow = 3;
  const startMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  for (let m = 0; m < monthsToShow; m++) {
    const monthDate = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
    const monthContainer = document.createElement("div");
    monthContainer.className = "calendar-month";

    const title = document.createElement("h3");
    title.textContent = monthDate.toLocaleString("default", { month: "long", year: "numeric" });
    monthContainer.appendChild(title);

    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    ["Wk", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
      const th = document.createElement("th");
      th.textContent = day;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    let date = new Date(firstDay);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));

    while (date <= lastDay || date.getDay() !== 1) {
      const row = document.createElement("tr");

      const weekNumberCell = document.createElement("td");
      weekNumberCell.textContent = getWeekNumber(date);
      row.appendChild(weekNumberCell);

      for (let d = 0; d < 7; d++) {
        const cell = document.createElement("td");

        if (date.getMonth() === monthDate.getMonth()) {
          cell.textContent = date.getDate();
          if (isToday(date)) {
            cell.classList.add("today");
          }
        }

        row.appendChild(cell);
        date.setDate(date.getDate() + 1);
      }

      table.appendChild(row);
    }

    monthContainer.appendChild(table);
    container.appendChild(monthContainer);
  }
}

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function isToday(date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

// Important Dates
async function loadImportantDates() {
  const container = document.getElementById("important-dates");
  const data = await fetchData("data/important-dates.json");

  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  ["Date", "Special Occasion", "Notes"].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  data.forEach(item => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = item.date;
    row.appendChild(dateCell);

    const occasionCell = document.createElement("td");
    occasionCell.textContent = item.occasion;
    row.appendChild(occasionCell);

    const notesCell = document.createElement("td");
    notesCell.textContent = item.notes;
    row.appendChild(notesCell);

    table.appendChild(row);
  });

  container.innerHTML = "";
  container.appendChild(table);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadClocks();
  loadCalendar();
  loadImportantDates();
});
