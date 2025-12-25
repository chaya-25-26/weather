// script.js - Weather App
import { API_KEY, BASE_URL } from './config.js';

// Utility: Validate city input
function validateCity(city) {
  return city && /^[a-zA-Z\s-]+$/.test(city.trim());
}

// Utility: Format date (for forecast)
function formatDate(dt_txt) {
  const date = new Date(dt_txt);
  return `${date.getHours()}:00`;
}

// DOM: Show/hide loading
function showLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
}

// DOM: Show error message
function showError(msg) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = msg;
  errorDiv.classList.toggle('hidden', !msg);
}

// DOM: Render current weather card
function renderWeather(data) {
  const weatherDiv = document.getElementById('weather-result');
  if (!data) {
    weatherDiv.innerHTML = '';
    return;
  }
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  const isFav = getFavorites().includes(data.name);
  weatherDiv.innerHTML = `
    <div class="weather-city-row">
      <span class="weather-city" style="font-size:1.3em; font-weight:600;">${data.name}</span>
      <button id="save-favorite-btn" title="${isFav ? 'Remove from Favorites' : 'Save to Favorites'}" aria-label="${isFav ? 'Remove from Favorites' : 'Save to Favorites'}" class="star-btn">${isFav ? '★' : '☆'}</button>
    </div>
    <img class="weather-icon" src="${iconUrl}" alt="${data.weather[0].description}">
    <div class="weather-temp">${Math.round(data.main.temp)}°</div>
    <div class="weather-desc">${data.weather[0].main} (${data.weather[0].description})</div>
    <div class="weather-details">
      <span>💧<br>${data.main.humidity}%<br>Humidity</span>
      <span>💨<br>${data.wind.speed} m/s<br>Wind</span>
    </div>
  `;
  // Add event listener for star button (toggle)
  document.getElementById('save-favorite-btn').onclick = function() {
    if (isFav) {
      removeFavorite(data.name);
    } else {
      saveFavorite(data.name);
    }
    renderWeather(data); // update star
  };
}

// FAVORITES: localStorage helpers
function getFavorites() {
  return JSON.parse(localStorage.getItem('weatherFavorites') || '[]');
}
function saveFavorite(city) {
  let favs = getFavorites();
  if (!favs.includes(city)) {
    favs.push(city);
    localStorage.setItem('weatherFavorites', JSON.stringify(favs));
    renderFavorites();
  }
}
function removeFavorite(city) {
  let favs = getFavorites();
  favs = favs.filter(f => f !== city);
  localStorage.setItem('weatherFavorites', JSON.stringify(favs));
  renderFavorites();
}
function renderFavorites() {
  const favList = document.getElementById('favorites-list');
  let favs = getFavorites();
  // Sorting
  const sortSel = document.getElementById('fav-sort');
  if (sortSel && sortSel.value === 'za') {
    favs = favs.slice().sort((a, b) => b.localeCompare(a));
  } else {
    favs = favs.slice().sort((a, b) => a.localeCompare(b));
  }
  // Filtering
  const filterInput = document.getElementById('fav-filter');
  const filterVal = filterInput ? filterInput.value.trim().toLowerCase() : '';
  if (filterVal) {
    favs = favs.filter(city => city.toLowerCase().includes(filterVal));
  }
  favList.innerHTML = '';
  if (favs.length === 0) {
    favList.innerHTML = '<li>No favorites yet.</li>';
    return;
  }
  favs.forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.className = 'favorite-item';
    li.onclick = () => {
      document.getElementById('city-input').value = city;
      document.getElementById('search-form').dispatchEvent(new Event('submit'));
    };
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✖';
    removeBtn.className = 'remove-favorite-btn';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeFavorite(city);
    };
    li.appendChild(removeBtn);
    favList.appendChild(li);
  });
}

// Add event listeners for sort/filter
window.addEventListener('DOMContentLoaded', () => {
  const sortSel = document.getElementById('fav-sort');
  const filterInput = document.getElementById('fav-filter');
  if (sortSel) sortSel.addEventListener('change', renderFavorites);
  if (filterInput) filterInput.addEventListener('input', renderFavorites);
});

// DOM: Render 5-day forecast grid (8 per day, show next 5 at 12:00)
function renderForecast(forecast) {
  const forecastDiv = document.getElementById('forecast');
  if (!forecast || !forecast.list) {
    forecastDiv.innerHTML = '';
    return;
  }
  // Filter for 12:00:00 each day
  const daily = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));
  forecastDiv.innerHTML = daily.map(item => {
    const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    const desc = item.weather[0].description;
    return `
      <div class="forecast-card">
        <div>${day}</div>
        <img class="forecast-icon" src="${iconUrl}" alt="${desc}">
        <div>${Math.round(item.main.temp)}°</div>
        <div style="font-size:0.95em; margin-top:2px;">${desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
      </div>
    `;
  }).join('');
}

// API: Fetch current weather
async function fetchWeather(city) {
  const url = `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found');
  return res.json();
}

// API: Fetch 5-day forecast
async function fetchForecast(city) {
  const url = `${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast not found');
  return res.json();
}

// Main: Get weather and forecast
async function getWeather(city) {
  showLoading(true);
  showError('');
  try {
    const weather = await fetchWeather(city);
    renderWeather(weather);
    const forecast = await fetchForecast(city);
    renderForecast(forecast);
  } catch (e) {
    renderWeather(null);
    renderForecast(null);
    showError(e.message);
  } finally {
    showLoading(false);
  }
}

// Event: Search form
const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const btn = document.getElementById('search-btn');
form.addEventListener('submit', e => {
  e.preventDefault();
  const city = input.value.trim();
  if (!validateCity(city)) {
    showError('Please enter a valid city name.');
    return;
  }
  btn.disabled = true;
  getWeather(city).finally(() => {
    btn.disabled = false;
  });
});

// Theme toggles
const themeBtn = document.getElementById('theme-toggle');
const colorThemeBtn = document.getElementById('color-theme-toggle');

function setTheme(theme) {
  document.body.classList.remove('dark', 'colorful');
  if (theme === 'dark') document.body.classList.add('dark');
  if (theme === 'colorful') document.body.classList.add('colorful');
  localStorage.setItem('weatherTheme', theme);
  // Update button icons
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  colorThemeBtn.textContent = document.body.classList.contains('colorful') ? '🌈' : '🎨';
}

themeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark')) setTheme('light');
  else setTheme('dark');
});
colorThemeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('colorful')) setTheme('light');
  else setTheme('colorful');
});

// Optional: Load last searched city from localStorage, render favorites, and set theme
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('weatherTheme') || 'light';
  setTheme(savedTheme);
  const last = localStorage.getItem('lastCity');
  if (last) {
    input.value = last;
    getWeather(last);
  }
  renderFavorites();
});
form.addEventListener('submit', () => {
  localStorage.setItem('lastCity', input.value.trim());
});

// Comments: All major functions are explained above for clarity.
