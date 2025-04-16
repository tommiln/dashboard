// Load cities
fetch("data/cities.json")
  .then((res) => res.json())
  .then((cities) => {
    const clocksContainer = document.getElementById("clocks");
    const timezoneContainer = document.getElementById("timezone");

    cities.forEach((city) => {
      const clockCard = document.createElement("div");
      clockCard.className = "clock-card";
      clockCard.style.backgroundImage = `url('${city.flag}')`;

      const cityName = document.createElement("div");
      cityName.className = "city-name";
      cityName.textContent = city.city.toUpperCase();

      const timeDisplay = document.createElement("div");
      timeDisplay.className = "time";
      timeDisplay.id = `${city.city.toLowerCase().replace(/\s+/g, "-")}-time`;

      const sunrise = document.createElement("div");
      sunrise.className = "sunrise";
      const sunset = document.createElement("div");
      sunset.className = "sunset";
      const daylength = document.createElement("div");
      daylength.className = "daylength";

      clockCard.append(cityName, timeDisplay, sunrise, sunset, daylength);
      clocksContainer.appendChild(clockCard);

      const tzRow = document.createElement("tr");
      tzRow.innerHTML = `<td>${city.city}</td>`;
      for (let i = -6; i <= 6; i++) {
        const cell = document.createElement("td");
        tzRow.appendChild(cell);
      }
      tzRow.className = "tz-row";
      timezoneContainer.appendChild(tzRow);
    });

    updateTime();
    setInterval(updateTime, 1000);
  });

function updateTime() {
  const now = new Date();
  document.querySelectorAll(".tz-row").forEach((row) => {
    row.querySelectorAll("td").forEach((cell, i) => {
      if (i === 0) return;
      const hourOffset = i - 7;
      const refTime = new Date(now.getTime() + hourOffset * 3600 * 1000);
      const hour = refTime.getHours();
      const icon = hour >= 6 && hour < 18 ? "☀️" : "🌙";
      cell.innerHTML = `${icon}<br>${hour}:00`;
      cell.className = hour === now.getHours() ? "highlight" : "";
    });
  });

  fetch("data/cities.json")
    .then((res) => res.json())
    .then((cities) => {
      cities.forEach((city) => {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: city.timezone,
        });
        document.getElementById(
          `${city.city.toLowerCase().replace(/\s+/g, "-")}-time`
        ).textContent = timeStr;
      });
    });
}

// Load important dates
fetch("data/important-dates.json")
  .then((res) => res.json())
  .then((dates) => {
    const table = document.getElementById("important-dates");
    dates.forEach((event) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${event.date}</td><td>${event.occasion}</td><td>${event.notes}</td>`;
      table.appendChild(row);
    });
  });
