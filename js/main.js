document.addEventListener("DOMContentLoaded", () => {
  const cities = ["New York", "London", "Brussels", "Helsinki", "Singapore"];
  const clocksContainer = document.getElementById("clocks");

  cities.forEach(city => {
    const clock = document.createElement("div");
    clock.className = "clock";
    clock.style.backgroundImage = `url(flags/${city.toLowerCase().replace(' ', '')}.png)`;

    const cityLabel = document.createElement("div");
    cityLabel.textContent = city.toUpperCase();

    const timeLabel = document.createElement("div");
    timeLabel.className = "time";
    timeLabel.textContent = "Loading...";

    const sunrise = document.createElement("div");
    sunrise.textContent = "Sunrise: N/A";

    const sunset = document.createElement("div");
    sunset.textContent = "Sunset: N/A";

    const dayLength = document.createElement("div");
    dayLength.textContent = "Day length: N/A";

    clock.append(cityLabel, timeLabel, sunrise, sunset, dayLength);
    clocksContainer.appendChild(clock);
  });
});
