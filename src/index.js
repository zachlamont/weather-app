console.log("its working");

document.body.style.backgroundImage = `url(images/clear.jpg)`;

const apiKey = "f406505da8c169dd39c0d2bbe2b2a93f";
const form = document.getElementById("cityForm");
const weatherData = document.getElementById("weatherData");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = document.getElementById("cityInput").value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const temp = data.main.temp - 273.15;
      const description = data.weather[0].description;

      // Create and populate weather data elements
      const weatherHeader = document.createElement("h2");
      const weatherTemp = document.createElement("p");
      const weatherDesc = document.createElement("p");
      weatherHeader.textContent = `Weather for ${data.name}`;
      weatherTemp.textContent = `Temperature: ${temp.toFixed(1)}°C`;
      weatherDesc.textContent = `Description: ${description}`;

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
        weatherImages[data.weather[0].main] || weatherImages.Clear;
      document.body.style.backgroundImage = `url(images/${backgroundImage})`;
      console.log(`url(dist/images/${backgroundImage})`);
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
});
