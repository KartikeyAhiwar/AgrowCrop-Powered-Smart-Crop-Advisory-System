
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserButton, useAuth } from "@clerk/clerk-react";
import ThemeToggle from './ThemeToggle'
import { useWeather } from '../context/WeatherContext'
import { NavbarWeatherIcon, WeatherStatusIcon } from './WeatherIcons'
import './Navbar.css'

const Navbar = () => {
  const { isWeatherVisible, toggleWeather, weather } = useWeather()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌾 AgrowCrop
        </Link>
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recommendations">Recommendations</Link></li>
          <li><Link to="/market-prices">Market Prices</Link></li>
          <li><Link to="/crop-calendar">Crop Calendar</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li className="theme-toggle-item">
            <ThemeToggle />
          </li>
          <li className="weather-icon-item">
            <span
              className={`weather-icon ${isWeatherVisible ? 'weather-icon-active' : ''}`}
              onClick={toggleWeather}
              title={isWeatherVisible ? "Hide Weather" : "Show Weather"}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {weather && weather.weather && weather.weather[0] ? (
                <WeatherStatusIcon
                  type={
                    weather.weather[0].main === "Rain" ? "rain" :
                      weather.weather[0].main === "Drizzle" ? "rain" :
                        weather.weather[0].main === "Thunderstorm" ? "rain" :
                          weather.weather[0].main === "Clouds" ? "cloud" :
                            weather.weather[0].main === "Snow" ? "winter" :
                              "sunny"
                  }
                  size={28}
                />
              ) : (
                <NavbarWeatherIcon size={28} />
              )}
            </span>
          </li>
          <li>
            <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
              <UserButton afterSignOutUrl="/" />
            </div>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

