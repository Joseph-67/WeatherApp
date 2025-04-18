const API_kEY = "49012bacb14d3b5f99c66d6069ac05a1" ;
// function to fetch data from the city entered by the user
function getWeather() {
// get the city name from the input field
let city = document.getElementById("cityInput").value ;
// check if the input is empty
if (city.trim() === "") {
    alert("please enter a city name");
return;

}
// fetch weather data from the entered city
fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
)
}
function getLocation() {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
        // Get the user's current position
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords; // Extract latitude and longitude
            // Fetch weather data for the current location
            fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
            