
const cityInput = document.querySelector("#city");
const result = document.querySelector("#btn");
const temprature = document.querySelector(".temp");
const message = document.querySelector(".message");
const time = document.querySelector(".time");
const rainProb = document.querySelector(".rain");

result.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city == "") {
        message.textContent = "Please enter your city name";
        return;
    }

    const locationURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    fetch(locationURL)
        .then(response => response.json())

        .then(locationData => {

            console.log(locationData);

            if (!locationData.results || locationData.results.length === 0) {
                throw new Error("Cannot find city");
            }

            const latitude = locationData.results[0].latitude;
            const longitude = locationData.results[0].longitude;

            const WeatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=auto`;

            return fetch(WeatherApi);
        })

        .then(response => response.json())

        .then(WeatherData => {

            console.log(WeatherData);

            const temp = WeatherData.current.temperature_2m;

            let newtime = WeatherData.current.time;

            const RainChance =
                WeatherData.hourly.precipitation_probability[0];

            newtime = new Date(WeatherData.current.time)
                .toLocaleString();

            temprature.textContent = `Temperature : ${temp}°C`;

            time.textContent = `Date & Time : ${newtime}`;

            if (RainChance < 25) {

                rainProb.textContent =
                    `Rain chance : ${RainChance}% ☀️`;

            }
            else if (RainChance < 50) {

                rainProb.textContent =
                    `Rain chance : ${RainChance}% 🌥️`;

            }
            else if (RainChance < 75) {

                rainProb.textContent =
                    `Rain chance : ${RainChance}% 🌦️`;

            }
            else if (RainChance < 90) {

                rainProb.textContent =
                    `Rain chance : ${RainChance}% 🌩️🌧️`;

            }
            else {

                rainProb.textContent =
                    `Rain chance : ${RainChance}% ⛈️🌩️🌧️`;
            }
        })

        .catch(error => {

            console.error(error);

            temprature.textContent = "Unable to get temperature";

            message.textContent = error.message;
        });
});

