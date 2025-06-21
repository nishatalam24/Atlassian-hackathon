import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

const weatherIcons = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Smoke: '🌫️',
  Haze: '🌫️',
  Dust: '🌫️',
  Fog: '🌫️',
  Sand: '🌫️',
  Ash: '🌫️',
  Squall: '🌬️',
  Tornado: '🌪️',
};

function WeatherPanel() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Delhi');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch weather for New Delhi by default
  useEffect(() => {
    fetchWeatherByCity('Delhi');
  }, []);

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const data = await invoke('getWeatherByCity', { city: cityName });
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
      setCity(cityName);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const loc = await invoke('getLocationByIP');
      const [lat, lon] = loc.loc.split(',');
      const data = await invoke('getWeatherByCoords', { lat, lon });
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
      setCity(`${loc.city}, ${loc.country}`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) fetchWeatherByCity(search.trim());
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>🌤️ Weather Panel</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', marginRight: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, background: '#36B37E', color: '#fff', border: 'none' }}>
          Search
        </button>
        <button type="button" onClick={fetchWeatherByLocation} style={{ marginLeft: 8, padding: '8px 16px', borderRadius: 4, background: '#0052CC', color: '#fff', border: 'none' }}>
          Use My Location
        </button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>Error: {error}</div>
      ) : weather ? (
        <div style={{ background: '#F4F5F7', borderRadius: 8, padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 32 }}>{weatherIcons[weather.weather[0].main] || '🌡️'}</div>
          <h3 style={{ margin: 0 }}>{city}</h3>
          <div style={{ fontSize: 24 }}>{weather.weather[0].main} ({weather.weather[0].description})</div>
          <div style={{ fontSize: 20, margin: '8px 0' }}>{weather.main.temp}°C</div>
          <div>Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s</div>
        </div>
      ) : null}
    </div>
  );
}

export default WeatherPanel;