const cities = [
  { name: "New York", timezone: "America/New_York", flag: "flags/us.png" },
  { name: "London", timezone: "Europe/London", flag: "flags/uk.png" },
  { name: "Brussels", timezone: "Europe/Brussels", flag: "flags/brussels.png" },
  { name: "Helsinki", timezone: "Europe/Helsinki", flag: "flags/finland.png" },
  { name: "Singapore", timezone: "Asia/Singapore", flag: "flags/singapore.png" },
];

const holidays = {
  "United States": [
    { date: "1 January 2025", name: "New Year's Day" },
    { date: "20 January 2025", name: "Martin Luther King, Jr. Day" },
    { date: "12 February 2025", name: "Lincoln's Birthday" },
    { date: "17 February 2025", name: "Washington's Birthday" },
    { date: "26 May 2025", name: "Memorial Day" },
    { date: "4 July 2025", name: "Independence Day" },
    { date: "1 September 2025", name: "Labour Day" },
    { date: "13 October 2025", name: "Columbus Day" },
    { date: "11 November 2025", name: "Veterans Day" },
    { date: "27 November 2025", name: "Thanksgiving Day" },
    { date: "25 December 2025", name: "Christmas Day" },
  ],
  "United Kingdom": [
    { date: "1 January 2025", name: "New Year's Day" },
    { date: "2 January 2025", name: "2 January" },
    { date: "17 March 2025", name: "Saint Patrick's Day" },
    { date: "18 April 2025", name: "Good Friday" },
    { date: "21 April 2025", name: "Easter Monday" },
    { date: "5 May 2025", name: "Early May Bank Holiday" },
    { date: "4 August 2025", name: "Summer Bank Holiday" },
    { date: "25 August 2025", name: "Summer Bank Holiday" },
    { date: "25 December 2025", name: "Christmas Day" },
    { date: "26 December 2025", name: "Boxing Day" },
  ],
  "Singapore": [
    { date: "1 January 2025", name: "New Year's Day" },
    { date: "29 January 2025", name: "Chinese New Year" },
    { date: "30 January 2025", name: "Chinese New Year" },
    { date: "31 March 2025", name: "Hari Raya Puasa" },
    { date: "18 April 2025", name: "Good Friday" },
    { date: "1 May 2025", name: "Labour Day" },
    { date: "12 May 2025", name: "Vesak Day" },
    { date: "9 August 2025", name: "National Day" },
    { date: "21 October 2025", name: "Deepavali" },
    { date: "25 December 2025", name: "Christmas Day" },
  ],
};

const importantDates = [
  { date: "18 April 2025", occasion: "Grace comes to Singapore", notes: "Around 4pm" },
  { date: "24 April 2025", occasion: "Flight to Bangkok", notes: "08:00 AM, Terminal 2" },
  { date: "27 April 2025", occasion: "Flight to Singapore", notes: "13:50, BKK-Suvarnabhumi Intl." },
  { date: "28 April 2025", occasion: "Grace goes back to New York", notes: "10:30 AM, Terminal 1" },
  { date: "11 May 2025", occasion: "Flight to London", notes: "SQ318 at 12:35 PM, Terminal 3 (Arrival at Heathrow)" },
  { date: "25 May 2025", occasion: "Flight to Singapore", notes: "SQ309 at 10:15 AM (London Gatwick)" },
  { date: "13 June 2025", occasion: "Flight to Helsinki", notes: "21:35, Terminal 1" },
  { date: "29 June 2025", occasion: "Flight to Singapore", notes: "00:25 NOTE THIS IS FRIDAY NIGHT BASICALLY" },
  { date: "12 July 2025", occasion: "Flight to New York", notes: "SQ24 at 12:10 PM, Terminal 3" },
  { date: "2 August 2025", occasion: "Flight to Singapore", notes: "SQ23, JFK at 22:15" },
];

function updateClocks() {
  const now = new Date();
  cities.forEach(city => {
    const cityTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: city.timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(now);

    document.getElementById(`${city.name}-time`).textContent = cityTime;
  });
}

function renderClocks() {
  const container = document.getElementById("clocks");
  container.innerHTML = "";
  cities.forEach(city => {
    const card = document.createElement("div");
    card.className = "clock-card";
    card.style.backgroundImage = `url(${city.flag})`;

    card.innerHTML = `
      <div class="city-flag" style="background-image: url(${city.flag});"></div>
      <div class="city-name">${city.name.toUpperCase()}</div>
      <div class="city-time" id="${city.name}-time">Loading...</div>
      <div class="city-sun" id="${city.name}-sun">Sunrise: N/A<br>Sunset: N/A<br>Day length: N/A</div>
    `;

    container.appendChild(card);
  });
}

function highlightTimeZone() {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const timeCells = document.querySelectorAll(".timezone-container td");

  timeCells.forEach(cell => {
    cell.classList.remove("highlight");
  });

  const headers = document.querySelectorAll(".timezone-container th");
  headers.forEach((header, index) => {
    if (header.textContent.includes(`${currentHour}:00`)) {
      document.querySelectorAll(`.timezone-container td:nth-child(${index + 1})`).forEach(cell => {
        cell.classList.add("highlight");
      });
    }
  });
}

function renderImportantDates() {
  const container = document.getElementById("important-dates");
  container.innerHTML = "<h3>Important Dates</h3><table><tr><th>Date</th><th>Special Occasion</th><th>Notes</th></tr>";

  importantDates.forEach(event => {
    container.innerHTML += `<tr><td>${event.date}</td><td>${event.occasion}</td><td>${event.notes}</td></tr>`;
  });

  container.innerHTML += "</table>";
}

function renderHolidays() {
  const container = document.getElementById("holidays");
  container.innerHTML = "<h3>Bank Holidays (US 🇺🇸, UK 🇬🇧, Singapore 🇸🇬)</h3><table><tr><th>Date</th><th>Holiday</th><th>Country</th></tr>";

  Object.entries(holidays).forEach(([country, list]) => {
    list.forEach(event => {
      container.innerHTML += `<tr><td>${event.date}</td><td>${event.name}</td><td>${country}</td></tr>`;
    });
  });

  container.innerHTML += "</table>";
}

function initialize() {
  renderClocks();
  renderImportantDates();
  renderHolidays();
  updateClocks();
  highlightTimeZone();
  setInterval(updateClocks, 60000);
  setInterval(highlightTimeZone, 60000);
}

document.addEventListener("DOMContentLoaded", initialize);