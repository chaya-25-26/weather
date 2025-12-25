# 🌦️ Weather App

A comprehensive weather dashboard that provides real-time weather information and forecasts for any city.

## 🚀 Features

- **City Search**: Search for weather conditions in any city
- **Current Weather**: Displays current temperature, weather condition, and location
- **5-Day Forecast**: View the upcoming weather trends
- **Favorites**: Save your favorite cities (using localStorage)
- **Theme Toggle**: Switch between Light, Dark, and Colorful modes
- **Responsive Design**: Looks great on desktop and mobile
- **Sorting/Filtering**: Organize your favorite cities
- **Pagination**: Load more forecast data on demand
- **CSS Animations**: Smooth transitions for UI elements

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- [OpenWeatherMap API](https://openweathermap.org/)

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. **Navigate to the project folder**
   ```sh
   cd Elect_Final_Chaya/Weather_Api
   ```
3. **Add your OpenWeatherMap API key**
   - Open `config.js` and insert your API key as instructed in the file.
4. **Open `index.html` in your web browser**
   - Double-click `index.html` or right-click and select “Open with” > your browser.

## 🖥️ How to Use

1. Open `index.html` in your web browser.
2. Enter a city name in the search box and click **Search**.
3. View the current weather and forecast on the dashboard.
4. Save cities to your favorites and manage them.
5. Toggle the theme using the moon/sun icon in the header.
6. Use sorting, filtering, and pagination features as needed.

## 📄 License

This project is open source and free to use.

## 🙏 Credits

Created by Chaya, December 2025.

---

## 📚 API Reference (OpenWeatherMap)

**Base URL:** `https://api.openweathermap.org/data/2.5`

**Endpoints:**
- `/weather` — Current weather data
- `/forecast` — 5-day weather forecast

**Required Parameters:**
- `q`: City name (e.g., "Dagupan")
- `appid`: Your unique API Key
- `units`: Unit of measurement (e.g., `metric`)

**Authentication:**
- API Key via query parameter (`appid=YOUR_API_KEY`)

**Sample JSON Response (Current Weather):**
```json
{
  "coord": { "lon": 120.34, "lat": 16.04 },
  "weather": [
    {
      "id": 803,
      "main": "Clouds",
      "description": "broken clouds",
      "icon": "04d"
    }
  ],
  "main": {
    "temp": 30.5,
    "feels_like": 33.2,
    "humidity": 65
  },
  "name": "Dagupan"
}
```
