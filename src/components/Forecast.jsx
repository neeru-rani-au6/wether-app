import React, { useState } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import useForecast from "../hooks/cityApi";  // Import the custom hook

function Forecast({ weather }) {
    const { data } = weather;
    const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit

    // Use the custom hook for forecast data
    const { forecastData, error } = useForecast(data.city);

    const formatDay = (dateString) => {
        const options = { weekday: "short" };
        const date = new Date(dateString * 1000);
        return date.toLocaleDateString("en-US", options);
    };

    const getCurrentDate = () => {
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        };
        const currentDate = new Date().toLocaleDateString("en-US", options);
        return currentDate;
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius((prevState) => !prevState);
    };

    const convertToFahrenheit = (temperature) => {
        return Math.round((temperature * 9) / 5 + 32);
    };

    const renderTemperature = (temperature) => {
        if (isCelsius) {
            return Math.round(temperature);
        } else {
            return convertToFahrenheit(temperature);
        }
    };

    return (
        <div>
            <div className="city-name">
                <h2>
                    {data.city}, <span>{data.country}</span>
                </h2>
            </div>
            <div className="date">
                <span>{getCurrentDate()}</span>
            </div>
            <div className="temp">
                {data.condition.icon_url && (
                    <img
                        src={data.condition.icon_url}
                        alt={data.condition.description}
                        className="temp-icon"
                    />
                )}
                {renderTemperature(data.temperature.current)}
                <sup className="temp-deg" onClick={toggleTemperatureUnit}>
                    {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
                </sup>
            </div>
            <p className="weather-des">{data.condition.description}</p>
            <div className="weather-info">
                <div className="col">
                    <ReactAnimatedWeather icon="WIND" size={40} />
                    <div>
                        <p className="wind">{data.wind.speed}m/s</p>
                        <p>Wind speed</p>
                    </div>
                </div>
                <div className="col">
                    <ReactAnimatedWeather icon="RAIN" size={40} />
                    <div>
                        <p className="humidity">{data.temperature.humidity}%</p>
                        <p>Humidity</p>
                    </div>
                </div>
            </div>

            {/* Display forecast data */}
            <div className="forecast">
                <h3>5-Day Forecast:</h3>
                <div className="forecast-container">
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        forecastData.slice(0, 5).map((day) => (
                            <div className="day" key={day.time}>
                                <p className="day-name">{formatDay(day.time)}</p>
                                {day.condition.icon_url && (
                                    <img
                                        className="day-icon"
                                        src={day.condition.icon_url}
                                        alt={day.condition.description}
                                    />
                                )}
                                <p className="day-temperature">
                                    {Math.round(day.temperature.minimum)}°/ <span>{Math.round(day.temperature.maximum)}°</span>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Forecast;
