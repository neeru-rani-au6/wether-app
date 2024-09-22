import React, { useState, useEffect, Suspense, lazy } from "react";
import PullToRefresh from "react-pull-to-refresh"; // Import the pull-to-refresh library
import Search from "./components/Search";
import useWeatherApi from "./hooks/weatherApi";

import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Forecast = lazy(() => import("./components/Forecast")); // Lazy load Forecast component

function App() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [lastSearchedCity, setLastSearchedCity] = useState("");

  const weather = useWeatherApi(query || lastSearchedCity);

  useEffect(() => {
    const cachedCity = localStorage.getItem("lastSearchedCity");
    if (cachedCity) {
      setLastSearchedCity(cachedCity);
    }
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
      setQuery(input);
      localStorage.setItem("lastSearchedCity", input); // Cache the last searched city
    }
  };

  const refreshWeather = () => {
    setQuery(lastSearchedCity);
  };

  return (
    <PullToRefresh onRefresh={refreshWeather}>
      <div className="App">
          <Search query={input} setQuery={setInput} search={handleSearch} />
        {weather.loading && (
          <>
            <br />
            <br />
            <h4>Searching..</h4>
          </>
        )}

        {(weather.error || weather.data.message === 'City not found') && (
          <>
            <br />
            <br />
            <span className="error-message">
              <span style={{ fontFamily: "font" }}>
                Sorry, city not found, please try again.
              </span>
            </span>
          </>
        )}

        <Suspense fallback={<div>Loading forecast...</div>}>
          {weather && weather.data && weather.data.condition && (
            <Forecast weather={weather} />
          )}
        </Suspense>
      </div>
    </PullToRefresh>
  );
}

export default App;
