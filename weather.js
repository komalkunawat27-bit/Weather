const cityInput = document.querySelector("#city");
const result = document.querySelector("#btn");
const temprature = document.querySelector(".temp");
const message = document.querySelector(".message");
const time = document.querySelector(".time");
const rainProb = document.querySelector(".rain");

result.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter your city name";
        return;
    }

    const locationURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    fetch(locationURL)

        .then(response => response.json())

        .then(locationData => {

            console.log("Location:", locationData);

            if (!locationData.results || locationData.results.length === 0) {
                throw new Error("Cannot find city");
            }

            const latitude = locationData.results[0].latitude;
            const longitude = locationData.results[0].longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            const weatherURL =
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=auto`;

            console.log("Weather URL:", weatherURL);

            return fetch(weatherURL);
        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Weather API returned an error");
            }

            return response.json();
        })

        .then(weatherData => {

            console.log("Weather:", weatherData);

            // Temperature
            const temp =
                weatherData.current.temperature_2m;

            // Current time from API
            const currentTime =
                weatherData.current.time;

            // Get current hour
            const currentHour =
                Number(currentTime.split("T")[1].split(":")[0]);

            // Get rain probability for current hour
            const rainChance =
                weatherData.hourly.precipitation_probability[currentHour];

            console.log("Current hour:", currentHour);
            console.log("Rain chance:", rainChance);

            // Display temperature
            temprature.textContent =
                `Temperature : ${temp}°C`;

            // Display time
            time.textContent =
                `Date & Time : ${currentTime.replace("T", " ")}`;

            // Display rain probability
            if (rainChance < 25) {

                rainProb.textContent =
                    `Rain chance : ${rainChance}% ☀️`;

            } else if (rainChance < 50) {

                rainProb.textContent =
                    `Rain chance : ${rainChance}% 🌥️`;

            } else if (rainChance < 75) {

                rainProb.textContent =
                    `Rain chance : ${rainChance}% 🌦️`;

            } else if (rainChance < 90) {

                rainProb.textContent =
                    `Rain chance : ${rainChance}% 🌩️🌧️`;

            } else {

                rainProb.textContent =
                    `Rain chance : ${rainChance}% ⛈️🌩️🌧️`;
            }

            message.textContent = "";
        })

        .catch(error => {

            console.error(error);

            temprature.textContent =
                "Unable to get temperature";

            time.textContent = "";

            rainProb.textContent = "";

            message.textContent =
                error.message;
        });
});
