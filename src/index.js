document.body.style.backgroundImage = `url(images/clear.jpg)`;

const apiKey = "f406505da8c169dd39c0d2bbe2b2a93f";
const dayCnt = "40";
const form = document.getElementById("cityForm");
const weatherData = document.getElementById("weatherData");
let city = "Sydney";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  city = document.getElementById("cityInput").value;
  displayWeather();
});

window.addEventListener("load", async () => {
  displayWeather();
});

async function displayWeather() {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${dayCnt}&appid=${apiKey}`;
  try {
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);
    if (weatherResponse.ok && forecastResponse.ok) {
      const weatherInfo = await weatherResponse.json();
      const forecastData = await forecastResponse.json();
      const temp = weatherInfo.main.temp - 273.15;
      const description = weatherInfo.weather[0].description;
      const capitalizedDescription = description
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Create and populate weather data elements
      const weatherHeader = document.createElement("h2");
      const weatherTemp = document.createElement("p");
      const weatherDesc = document.createElement("p");
      weatherTemp.classList.add("temperature");
      weatherHeader.textContent = `${weatherInfo.name}`;
      weatherTemp.textContent = `${temp.toFixed(1)}°C`;
      weatherDesc.textContent = capitalizedDescription;

      // Append weather data elements to weatherData div
      weatherData.innerHTML = "";
      weatherData.appendChild(weatherHeader);
      weatherData.appendChild(weatherTemp);
      weatherData.appendChild(weatherDesc);

      // Set background image based on weather description
      const weatherImages = {
        Thunderstorm: "thunderstorm.jpg",
        Drizzle: "drizzle.jpg",
        Rain: "rain.jpg",
        Snow: "snow.jpg",
        Clear: "clear.jpg",
        Clouds: "clouds.jpg",
      };
      const backgroundImage =
        weatherImages[weatherInfo.weather[0].main] || weatherImages.Clear;
      document.body.style.backgroundImage = `url(images/${backgroundImage})`;
      console.log(`url(images/${backgroundImage})`);

      // Display forecast data
      displayForecastData(forecastData);
    } else {
      // Create and populate error message element
      const errorContainer = document.createElement("p");
      errorContainer.textContent = `Error retrieving weather data for ${city}.`;

      // Append error message element to weatherData div
      weatherData.innerHTML = "";
      weatherData.appendChild(errorContainer);
    }
  } catch (error) {
    console.error(error);

    // Create and populate error message element
    const errorContainer = document.createElement("p");
    errorContainer.textContent = `Error retrieving weather data for ${city}.`;

    // Append error message element to weatherData div
    weatherData.innerHTML = "";
    weatherData.appendChild(errorContainer);
  }
}

function displayForecastData(data) {
  const forecastData = document.getElementById("forecastData");
  forecastData.innerHTML = "";

  console.log(data);

  // Group forecast data by day
  const dayGroups = {};
  for (let i = 0; i < data.list.length; i++) {
    const day = getDayName(data.list[i].dt);
    if (!dayGroups[day]) {
      dayGroups[day] = [];
    }
    dayGroups[day].push(data.list[i]);
  }

  // Create a forecast row for each day
  for (const day in dayGroups) {
    const forecasts = dayGroups[day];

    // Calculate lowest temp_min and highest temp_max for the day
    let lowestTempMin = forecasts[0].main.temp_min;
    let highestTempMax = forecasts[0].main.temp_max;
    for (let i = 1; i < forecasts.length; i++) {
      const tempMin = forecasts[i].main.temp_min;
      const tempMax = forecasts[i].main.temp_max;
      if (tempMin < lowestTempMin) {
        lowestTempMin = tempMin;
      }
      if (tempMax > highestTempMax) {
        highestTempMax = tempMax;
      }
    }

    // Create forecast row for the day
    const forecastRow = document.createElement("div");
    forecastRow.classList.add("forecastRow");

    const dayName = document.createElement("div");
    dayName.classList.add("day-name");
    dayName.textContent = day;

    const weatherEmoji = document.createElement("div");
    weatherEmoji.classList.add("table-item");
    weatherEmoji.textContent = getWeatherEmoji(forecasts[0].weather[0].main);

    const minTemp = document.createElement("div");
    minTemp.classList.add("table-item", "min");
    minTemp.textContent = `${(lowestTempMin - 273.15).toFixed(1)}°C`;

    const maxTemp = document.createElement("div");
    maxTemp.classList.add("table-item", "max");
    maxTemp.textContent = `${(highestTempMax - 273.15).toFixed(1)}°C`;

    forecastRow.appendChild(dayName);
    forecastRow.appendChild(weatherEmoji);
    forecastRow.appendChild(minTemp);
    forecastRow.appendChild(maxTemp);

    forecastData.appendChild(forecastRow);
  }
}

function getDayName(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const options = { weekday: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function getWeatherEmoji(weatherMain) {
  const weatherEmojis = {
    Thunderstorm: "⛈️",
    Drizzle: "🌧️",
    Rain: "🌧️",
    Snow: "❄️",
    Clear: "☀️",
    Clouds: "☁️",
  };
  return weatherEmojis[weatherMain] || "";
}
