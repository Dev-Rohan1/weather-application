/**
 * Title: Weather application using JavaScript.
 * Description: This js file has all the js functions necessary to control the weather apps.
 * Author: (Dev Rohan).
 * Date: 07/09/2023.
 */

// select elements & assing them to variable  
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const cityOutput = document.querySelector('.city-input');
const weatherCardsDiv = document.querySelector('.weather-cards');
const currentWeatherDiv = document.querySelector('.current-weather');
const apiKey ="2bef135a4f323f1a4cf7ce4fd5cdfd67"; // api key

// necessary function

const  createWeatherCard = (cityName, weatherIteam, index) => {
    if (index === 0) {
        return `
            <div class="weather-details">
                <h2>${cityName} (${weatherIteam.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: ${Math.floor((weatherIteam.main.temp - 273.15).toFixed(2))}°C</h4>
                <h4>Wind: ${weatherIteam.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherIteam.main.humidity}%</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherIteam.weather[0].icon}@4x.png"
                />
                <h4>${weatherIteam.weather[0].description}</h4>
            </div>`;
    } else {
        return `<li class="cards">
                <h3>(${weatherIteam.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherIteam.weather[0].icon}@2x.png" alt="weather-icon"/>
                <h4>Temp: ${Math.floor((weatherIteam.main.temp - 273.15).toFixed(2))}°C</h4>
                <h4>Wind: ${weatherIteam.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherIteam.main.humidity}%</h4>
            </li>`
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`; //weatherApiUrl

    fetch(weatherApiUrl).then(res => res.json()).then(data => {
        const uniqueForecastDay = [];
        const fiveDaysForeCast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();  
            if (!uniqueForecastDay.includes(forecastDate)) {
                return uniqueForecastDay.push(forecastDate);
            }     
        });
        cityOutput.value = ""
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        console.log(fiveDaysForeCast);
        fiveDaysForeCast.forEach((weatherIteam, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherIteam, index))
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherIteam, index));
            }
        });

    }).catch(() => {
        alert('an error occurred while fecthing the weather forecast !');
    });
}

const getCityCoordinate = () => {
    const cityName = cityOutput.value.trim();
    if (!cityName) return ;
    const geoCodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`; // geoCodingApi
    fetch(geoCodingApi).then(res => res.json()).then(data => {
        if (!data.length) return alert(`no coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert('an error occurred while fecthing the coordinates !');
    });
}

// current location function
const getUserCoordinate = () => {
    navigator.geolocation.getCurrentPosition( 
        position => {
            const { latitude, longitude} = position.coords;
            const reverseGeoCodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`; // reverseGeoCodingUrl api url
            fetch(reverseGeoCodingUrl).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert('an error occurred while fecthing the city !');
            });
        },
        error => {
           if (error.code === error.PERMISSION_DENIED) {
            alert('geolocation request denied. pleace reset location permission to grant access again.');
           } 
        }
    );
}

//event listener
searchBtn.addEventListener('click', getCityCoordinate);
locationBtn.addEventListener('click', getUserCoordinate);