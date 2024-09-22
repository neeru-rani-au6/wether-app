import { useState, useEffect } from "react";
import axios from "axios";

const useForecast = (city) => {
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        setForecastData(response.data.daily);
      } catch (err) {
        setError("Error fetching forecast data.");
        console.log("Error:", err);
      }
    };

    if (city) {
      fetchForecastData();
    }
  }, [city]);

  return { forecastData, error };
};

export default useForecast;
