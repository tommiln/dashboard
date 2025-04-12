:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --card-bg: #f9f9f9;
  --border-color: #dddddd;
  --highlight-color: #ff3b30;
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --clock-bg: #eeeeee;
  --highlight-bg: #ffd700;
}

body.dark-mode {
  --bg-color: #1e1e1e;
  --text-color: #f0f0f0;
  --card-bg: #2c2c2c;
  --border-color: #444444;
  --clock-bg: #3a3a3a;
  --highlight-bg: #555555;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-family);
}

body {
  background: var(--bg-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  transition: background 0.3s, color 0.3s;
}

.toggle-mode {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

h1 {
  margin-bottom: 20px;
  font-size: 2.5rem;
}

.calendar-container {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 12px;
  background: var(--card-bg);
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

.calendar {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  text-align: center;
}

.calendar h3 {
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 6px;
  text-align: center;
  border: 1px solid var(--border-color);
}

th {
  background-color: var(--border-color);
}

.today {
  background-color: var(--highlight-color);
  color: white;
  border-radius: 50%;
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
}

.timezones {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  max-width: 1200px;
  width: 100%;
}

.clock {
  background: var(--clock-bg);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.clock .city {
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.clock .time {
  font-weight: bold;
  margin: 4px 0;
  font-size: 1.6rem;
}

.clock .sunrise,
.clock .sunset,
.clock .daylength {
  margin: 4px 0;
  font-size: 0.95rem;
}

.comparison {
  max-width: 1200px;
  width: 100%;
  overflow-x: auto;
  position: relative;
  margin-top: 40px;
}

.comparison-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.city-name {
  width: 120px;
  font-weight: bold;
  text-align: right;
  padding-right: 10px;
}

.hour-block {
  width: 80px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  position: relative;
  font-size: 0.8rem;
}

.hour-block .icon {
  font-size: 1rem;
  margin-bottom: 4px;
}

.current-hour {
  background-color: var(--highlight-bg);
}