document.addEventListener("DOMContentLoaded", () => {
  const cities = [
    { name: "New York", timezone: "America/New_York", code: "us" },
    { name: "London", timezone: "Europe/London", code: "uk" },
    { name: "Brussels", timezone: "Europe/Brussels", code: "brussels" },
    { name: "Helsinki", timezone: "Europe/Helsinki", code: "finland" },
    { name: "Singapore", timezone: "Asia/Singapore", code: "singapore" },
  ];

  const clocksContainer = document.getElementById("clocks");
  clocksContainer.innerHTML = ""; // Clear it first

  cities.forEach(city => {
    const card = document.createElement("div");
    card.className = "clock-card";
    card.style.backgroundImage = `url('flags/${city.code}.jpeg')`;

    const cityName = document.createElement("div");
    cityName.className = "city-name";
    cityName.textContent = city.name.toUpperCase();

    const timeText = document.createElement("div");
    timeText.className = "city-time";
    timeText.textContent = "Loading...";

    const sunrise = document.createElement("div");
    sunrise.className = "sun-info";
    sunrise.textContent = "Sunrise: N/A";

    const sunset = document.createElement("div");
    sunset.className = "sun-info";
    sunset.textContent = "Sunset: N/A";

    const dayLength = document.createElement("div");
    dayLength.className = "sun-info";
    dayLength.textContent = "Day length: N/A";

    card.appendChild(cityName);
    card.appendChild(timeText);
    card.appendChild(sunrise);
    card.appendChild(sunset);
    card.appendChild(dayLength);
    clocksContainer.appendChild(card);

    updateClock(city, timeText, sunrise, sunset, dayLength);
    setInterval(() => updateClock(city, timeText, sunrise, sunset, dayLength), 60000);
  });

  function updateClock(city, timeText, sunrise, sunset, dayLength) {
    const now = new Date();
    const localTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: city.timezone,
    }).format(now);

    timeText.textContent = localTime;

    // Optional: Connect to a sunrise/sunset API here if desired
    sunrise.textContent = "Sunrise: N/A";
    sunset.textContent = "Sunset: N/A";
    dayLength.textContent = "Day length: N/A";
  }
});
