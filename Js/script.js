// API key for OpenWeatherMap API
const API_KEY = "49012bacb14d3b5f99c66d6069ac05a1";  // Replace with your API key

// Flag to track whether the temperature is displayed in Celsius
let isCelsius = true;

// Function to fetch weather data for a city entered by the user
function getWeather() {
    // Get the city name from the input field
    let city = document.getElementById("cityInput").value;

    // Check if the input is empty
    if (city.trim() === "") {
        alert("Please enter a city name!"); // Alert the user if no city is entered
        return;
    }

    // Fetch weather data for the entered city in metric units (Celsius)
    fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
}

// Function to fetch weather data based on the user's current location
function getLocation() {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
        // Get the user's current position
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords; // Extract latitude and longitude
            // Fetch weather data for the current location
            fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        }, () => {
            // Handle case where geolocation access is denied
            alert("Geolocation access denied. Please enable it and try again.");
        });
    } else {
        // Handle case where geolocation is not supported
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to fetch weather data from the API
function fetchWeatherData(url) {
    fetch(url)
        .then(response => response.json()) // Parse the JSON response
        .then(data => updateWeatherUI(data)) // Update the UI with the fetched data
        .catch(() => alert("Failed to fetch weather data. Please try again!")); // Handle fetch errors
}

// Function to update the weather information on the UI
function updateWeatherUI(data) {
    // Check if the API returned an error (e.g., city not found)
    if (data.cod !== 200) {
        alert("City not found! Please try again."); // Alert the user if the city is invalid
        return;
    }

    // Update city name and country
    document.getElementById("cityName").innerText = `${data.name}, ${data.sys.country}`;
    // Update weather description
    document.getElementById("weatherDescription").innerText = data.weather[0].description;
    // Update weather icon
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Update temperature in Celsius
    let temp = data.main.temp;
    document.getElementById("temperature").innerHTML = `${temp.toFixed(1)}°C`;
    // Update humidity
    document.getElementById("humidity").innerText = data.main.humidity;
    // Update wind speed
    document.getElementById("windSpeed").innerText = data.wind.speed;

    // Add functionality to toggle between Celsius and Fahrenheit
    document.getElementById("toggleUnit").onclick = function() {
        isCelsius = !isCelsius; // Toggle the temperature unit
        let convertedTemp = isCelsius ? temp : (temp * 9/5) + 32; // Convert temperature
        document.getElementById("temperature").innerHTML = `${convertedTemp.toFixed(1)}°${isCelsius ? "C" : "F"}`; // Update temperature display
        this.innerText = `Switch to ${isCelsius ? "°F" : "°C"}`; // Update button text
    };

    // Fetch and display the 5-day weather forecast
    fetchForecast(data.coord.lat, data.coord.lon);
}

// Function to fetch the 5-day weather forecast
function fetchForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then(response => response.json()) // Parse the JSON response
        .then(data => updateForecastUI(data)); // Update the UI with the forecast data
}

// Function to update the 5-day weather forecast on the UI
function updateForecastUI(data) {
    let forecastDiv = document.getElementById("forecast"); // Get the forecast container
    forecastDiv.innerHTML = "<h4>5-Day Forecast</h4>"; // Add a heading for the forecast

    // Filter the forecast data to get one entry per day (every 8th entry)
    let forecastData = data.list.filter((_, index) => index % 8 === 0);

    // Loop through the filtered forecast data and display it
    forecastData.forEach(day => {
        let date = new Date(day.dt_txt); // Convert the date string to a Date object
        let temp = day.main.temp; // Get the temperature
        let icon = day.weather[0].icon; // Get the weather icon

        // Add a forecast item to the forecast container
        forecastDiv.innerHTML += `
            <div class="forecast-item">
                <p><strong>${date.toDateString()}</strong></p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${temp.toFixed(1)}°C</p>
            </div>
        `;
    });
}

// Function to toggle dark mode for the application
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode"); // Toggle the "dark-mode" class on the body element
}
