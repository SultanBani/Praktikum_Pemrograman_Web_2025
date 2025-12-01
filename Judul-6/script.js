// Konfigurasi API
const API_KEY = '34ddc4592ff8f4b98caad3bc4b14bc2a'; // Gunakan API Key yang sudah kamu punya sebelumnya
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// State (Status Aplikasi)
let currentCity = 'Jakarta';
let isCelsius = true;
let isDarkMode = false;
let updateInterval;
let favoriteCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];

// Kota Populer untuk Autocomplete
const popularCities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 
    'Makassar', 'Palembang', 'Tangerang', 'Bandar Lampung', 'Depok',
    'London', 'New York', 'Tokyo', 'Paris', 'Singapore',
    'Sydney', 'Dubai', 'Los Angeles', 'Hong Kong', 'Bangkok'
];

// Elemen DOM
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const autocomplete = document.getElementById('autocomplete');
const tempToggle = document.getElementById('tempToggle');
const themeToggle = document.getElementById('themeToggle');
const refreshBtn = document.getElementById('refreshBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const addFavoriteBtn = document.getElementById('addFavoriteBtn');
const updateIntervalSelect = document.getElementById('updateIntervalSelect');

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    loadWeatherData(currentCity);
    
    // Ambil nilai interval dari dropdown (default 5 menit)
    const initialInterval = parseInt(updateIntervalSelect.value);
    startAutoUpdate(initialInterval);

    renderFavorites();
    
    // Muat preferensi tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }
});

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = citySearch.value.trim();
    if (city) {
        loadWeatherData(city);
        citySearch.value = '';
        autocomplete.style.display = 'none';
    }
});

citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

citySearch.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 0) {
        const filtered = popularCities.filter(city => 
            city.toLowerCase().includes(value)
        );
        showAutocomplete(filtered);
    } else {
        autocomplete.style.display = 'none';
    }
});

// Listener saat dropdown interval diubah
updateIntervalSelect.addEventListener('change', (e) => {
    const newInterval = parseInt(e.target.value);
    startAutoUpdate(newInterval);
    console.log(`Interval update diubah menjadi ${newInterval} menit.`);
});

tempToggle.addEventListener('click', toggleTemperature);
themeToggle.addEventListener('click', toggleTheme);
refreshBtn.addEventListener('click', () => loadWeatherData(currentCity));
addFavoriteBtn.addEventListener('click', addToFavorites);

// Functions
async function loadWeatherData(city) {
    showLoading(true);
    hideError();

    try {
        // Ambil cuaca saat ini (tambah parameter lang=id untuk Bahasa Indonesia)
        const currentResponse = await fetch(
            `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`
        );

        if (!currentResponse.ok) {
            throw new Error('Kota tidak ditemukan');
        }

        const currentData = await currentResponse.json();

        // Ambil prakiraan 5 hari (tambah parameter lang=id)
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=id`
        );

        const forecastData = await forecastResponse.json();

        currentCity = city;
        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        showError('Gagal memuat data. Periksa nama kota dan coba lagi.');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

function displayCurrentWeather(data) {
    const temp = isCelsius ? data.main.temp : celsiusToFahrenheit(data.main.temp);
    const feelsLike = isCelsius ? data.main.feels_like : celsiusToFahrenheit(data.main.feels_like);

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('timestamp').textContent = formatDate(new Date());
    document.getElementById('temperature').textContent = Math.round(temp);
    document.querySelector('.temp-unit').textContent = isCelsius ? '°C' : '°F';
    // Deskripsi cuaca akan otomatis bahasa Indonesia karena parameter &lang=id
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('feelsLike').textContent = `${Math.round(feelsLike)}°`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    // Ambil satu data per hari (sekitar jam 12:00 siang)
    const dailyForecasts = data.list.filter(item => 
        item.dt_txt.includes('12:00:00')
    ).slice(0, 5);

    dailyForecasts.forEach(day => {
        const temp = isCelsius ? day.main.temp : celsiusToFahrenheit(day.main.temp);
        const tempMin = isCelsius ? day.main.temp_min : celsiusToFahrenheit(day.main.temp_min);
        const tempMax = isCelsius ? day.main.temp_max : celsiusToFahrenheit(day.main.temp_max);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${formatForecastDate(new Date(day.dt * 1000))}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            </div>
            <div class="forecast-temp">
                ${Math.round(tempMin)}° / ${Math.round(tempMax)}°
            </div>
            <div class="forecast-description">${day.weather[0].description}</div>
        `;
        forecastContainer.appendChild(card);
    });
}

function showAutocomplete(cities) {
    autocomplete.innerHTML = '';
    if (cities.length > 0) {
        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = city;
            item.addEventListener('click', () => {
                citySearch.value = city;
                autocomplete.style.display = 'none';
                loadWeatherData(city);
            });
            autocomplete.appendChild(item);
        });
        autocomplete.style.display = 'block';
    } else {
        autocomplete.style.display = 'none';
    }
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    loadWeatherData(currentCity);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function addToFavorites() {
    if (!favoriteCities.includes(currentCity)) {
        favoriteCities.push(currentCity);
        localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
        renderFavorites();
    }
}

function renderFavorites() {
    const container = document.getElementById('favoriteCities');
    container.innerHTML = '';

    if (favoriteCities.length === 0) {
        container.innerHTML = '<p style="opacity: 0.6;">Belum ada kota favorit</p>';
        return;
    }

    favoriteCities.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.className = 'favorite-city';
        cityElement.innerHTML = `
            <span onclick="loadWeatherData('${city}')">${city}</span>
            <span class="remove-favorite" onclick="removeFavorite('${city}')">×</span>
        `;
        container.appendChild(cityElement);
    });
}

function removeFavorite(city) {
    favoriteCities = favoriteCities.filter(c => c !== city);
    localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
    renderFavorites();
}

// Fungsi Update Otomatis Dinamis
function startAutoUpdate(minutes) {
    // Hapus interval lama jika ada
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Set interval baru (menit * 60 detik * 1000 milidetik)
    const ms = minutes * 60 * 1000;
    
    updateInterval = setInterval(() => {
        loadWeatherData(currentCity);
    }, ms);
}

function showLoading(show) {
    loading.classList.toggle('show', show);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

function hideError() {
    errorMessage.classList.remove('show');
}

// Fungsi Bantuan
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Format Tanggal Indonesia (Senin, 1 Desember 2025...)
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

// Format Tanggal Singkat (Sen, 1 Des)
function formatForecastDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}