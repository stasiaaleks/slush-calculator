import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface weatherData {
    currentTemp: number;
    minTemp: number;
    maxTemp: number;
    precForecast: number;
    town: string;
}

const SlushCalculator: React.FC = () => {
  const API_KEY = `9608c0f2faac47459ec102035240106`;
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [slush, setSlushEstimate] = useState<string>('');
  const [weatherData, setWeatherData] = useState<weatherData | null>(null);

  function handleClick() {
    window.location.reload();
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else {
      alert('Geolocation is not supported');
    }
  }, []);

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location.lat},${location.lon}`);
          setWeather(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchWeather();
    }
  }, [location]);

  useEffect(() => {
    if (weather) {
      const { temp_c } = weather.current;
      const { name } = weather.location;
      const { mintemp_c, maxtemp_c, totalprecip_mm } = weather.forecast.forecastday[0].day;
      
      setWeatherData({
        currentTemp: temp_c,
        minTemp: mintemp_c,
        maxTemp: maxtemp_c,
        precForecast: totalprecip_mm,
        town: name
      });
      
      if (mintemp_c < 0 && maxtemp_c > 0 && totalprecip_mm > 0) {
        setSlushEstimate('Можлива слякоть, так що краще не вдягай білі конверси');
      } else {
        setSlushEstimate('Слякоти не буде, не переживай');
      }
    }
  }, [weather]);


  
  return (
    <div>
      <h1>Slushhhhhhhhhh?????</h1>
      {location ? (
        <div>
          {weather ? (
            <div>
              <p>Знайшла тебе: {weatherData?.town}, {location.lat}, {location.lon}</p>
              <p>Мінімальна температура сьогодні: {weatherData?.minTemp}°C</p>
              <p>Температура зараз: {weatherData?.currentTemp}°C</p>
              <p>Можливо, будуть опади: { weatherData?.precForecast }mm</p>
              <h2>{slush}</h2>
              <button onClick={handleClick} style={{backgroundColor:'#ADD8E6'}}>Reload data</button>
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </div>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
}

export default SlushCalculator;