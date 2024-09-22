import { useEffect, useState } from "react";
import axios from "axios";

const useWeatherApi = (query) => {
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  useEffect(() => {
    const fetchWeather = async () => {
      // Check localStorage for cached weather data
      const cachedData = localStorage.getItem("weatherData");
      if (cachedData && !query) {
        setWeather({ data: JSON.parse(cachedData), loading: false, error: false });
        return;
      }

      if (!query) return;
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
     
      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

      setWeather({ ...weather, loading: true });

      try {
        const response = await axios.get(url);
        setWeather({ data: response.data, loading: false, error: false });

        // Store the latest weather data in localStorage
        localStorage.setItem("weatherData", JSON.stringify(response.data));
        localStorage.setItem("lastSearchedCity", query);
      } catch (error) {
        setWeather({ ...weather, loading: false, error: true });
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
    // eslint-disable-next-line
  }, [query]);

  return weather;
};

export default useWeatherApi;
