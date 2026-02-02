
import React from 'react'
import { Link } from 'react-router-dom'
import WeatherWidget from './WeatherWidget'
import { useWeather } from '../context/WeatherContext'
import './Home.css'

const Home = () => {
  const { isWeatherVisible } = useWeather()

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            🌾 AgrowCrop
          </h1>
          <p className="hero-subtitle">
            Smart Farming Platform for Indian Farmers
          </p>
          <p className="hero-description">
            Crop recommendations based on your region and season.
            Simplify farming decisions with data-driven insights.
          </p>
          <div className="hero-buttons">
            <Link to="/recommendations" className="btn btn-primary btn-large">
              Get Recommendations
            </Link>
            <Link to="/faq" className="btn btn-secondary btn-large">
              Learn More
            </Link>
          </div>
        </div>

        {/* Weather Widget - conditionally rendered with animation */}
        <div className={`weather-widget-container ${isWeatherVisible ? 'weather-visible' : 'weather-hidden'}`}>
          {isWeatherVisible && <WeatherWidget />}
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="section-title">Why Choose AgrowCrop?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Simple Input</h3>
              <p>Just select your farming season and region. We handle the rest.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart Analysis</h3>
              <p>Advanced analysis of climate, soil, rainfall, and historical data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Crop Calendar</h3>
              <p>Month-wise timeline for sowing, growth, irrigation, and harvesting.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💧</div>
              <h3>Irrigation Guidance</h3>
              <p>Get precise irrigation percentage requirements for optimal yield.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Fertilizer Advice</h3>
              <p>Expert guidance on when and how to apply fertilizers (khaad).</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>FAQ & Guidance</h3>
              <p>Comprehensive answers to common farming questions in simple language.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

