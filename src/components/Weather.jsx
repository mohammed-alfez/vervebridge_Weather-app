import React, { useEffect, useRef, useState } from 'react';
import './Weather.css'; // Import the CSS file for styling
import search_icon from '../assets/search.png'; // Import the search icon
import clear_icon from '../assets/clear.png'; // Import the clear icon
import cloud_icon from '../assets/cloud.png'; // Import the cloud icon
import drizzle_icon from '../assets/drizzle.png'; // Import the drizzle icon
import rain_icon from '../assets/rain.png'; // Import the rain icon
import wind_icon from '../assets/wind.png'; // Import the wind icon
import humidity_icon from '../assets/humidity.png'; // Import the humidity icon
import snow_icon from "../assets/snow.png"; // Import the snow icon

const Weather = () => {
    const inputRef = useRef(); // Create a ref to the input element
    const [forecastData, setForecastData] = useState(null); // State to hold the forecast data

    // Object mapping weather icons from API to local icons
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    // Function to fetch weather data for a given city
    const search = async (city) => {
        if (!city) { // Check if the city name is provided
            alert("Enter City Name"); // Alert the user to enter a city name
            return;
        }
        try {
            const apiKey = import.meta.env.VITE_APP_ID; // Get the API key from environment variables
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
            const response = await fetch(url); // Fetch the weather data
            const data = await response.json(); // Parse the JSON response

            if (!response.ok) { // Check if the response is not okay
                alert(data.message || "Failed to fetch weather data."); // Alert the user
                return;
            }

            // Process the forecast data
            const forecast = data.list.reduce((acc, item) => {
                // Extract day name
                const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    
                if (!acc[date]) { // If the date is not already in the accumulator
                    acc[date] = {
                        temperature: Math.floor(item.main.temp), // Round the temperature
                        humidity: item.main.humidity, // Get the humidity
                        windSpeed: item.wind.speed, // Get the wind speed
                        icon: allIcons[item.weather[0].icon] || clear_icon, // Get the corresponding icon
                        date
                    };
                }
    
                return acc;
            }, {});
    
            setForecastData(Object.values(forecast)); // Set the forecast data state
        } catch (error) {
            setForecastData(null); // Clear the forecast data in case of error
            console.error("Error in fetching data:", error); // Log the error
        }
    };

    useEffect(() => {
        search("Chittaurgarh"); // Fetch weather data for Chittaurgarh on component mount
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' /> {/* Input field for city name */}
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => search(inputRef.current.value)} // Search on icon click
                />
            </div>
            {forecastData ? ( // Check if forecast data is available
                <div className='forecast'>
                    {forecastData.map((day, index) => ( // Map through the forecast data
                        <div key={index} className='forecast-day'>
                            <img src={day.icon} alt="Weather Icon" className='weather-icon' />
                            <p className='temperature'>{day.temperature}°C</p>
                            <p className='date'>{day.date}</p>
                            <div className="weather-data">
                                <div className="col">
                                    <img src={humidity_icon} alt="Humidity" />
                                    <div>
                                        <p>{day.humidity}%</p>
                                        <span>Humidity</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <img src={wind_icon} alt="Wind Speed" />
                                    <div>
                                        <p>{day.windSpeed} km/h</p>
                                        <span>Wind Speed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No forecast data available</p> // Message when no data is available
            )}
        </div>
    );
};

export default Weather; // Export the Weather component
