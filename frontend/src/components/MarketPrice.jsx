import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MockMarketPriceService } from '../services/mockMarketPriceService';
import './MarketPrice.css';

const MarketPrice = () => {
    // State management
    const [crop, setCrop] = useState('Wheat');
    const [state, setState] = useState('Madhya Pradesh');
    const [city, setCity] = useState('');
    const [prices, setPrices] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [useMockData, setUseMockData] = useState(false); // Try real backend first

    // Options for dropdowns
    // Comprehensive crop list with regional varieties (22 crops)
    const crops = [
        'Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'Bajra', 'Jowar', 'Tur',
        'Groundnut', 'Onion', 'Potato', 'Tomato', 'Sugarcane', 'Mustard', 'Sunflower',
        'Moong', 'Urad', 'Chana', 'Arhar', 'Masoor', 'Sesame', 'Castor'
    ];

    // All major Indian states (20 states)
    const states = [
        'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
        'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
        'West Bengal', 'Jharkhand', 'Uttarakhand', 'Himachal Pradesh', 'Assam'
    ];

    const API_BASE_URL = '/api/market-prices';

    // Fetch prices from backend or mock data
    const fetchPrices = async () => {
        if (!crop || !state) {
            setError('Please select both crop and state');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Minimum loading to show loading state
            const startTime = Date.now();
            const minLoadingTime = 600; // 0.6 seconds
            if (useMockData) {
                // Use mock data
                const optResponse = await MockMarketPriceService.getOptimizedRecommendation(crop, state, city);
                setRecommendation(optResponse);
                setPrices(optResponse.allOptions || []);

                const trendResponse = await MockMarketPriceService.getTrendData(optResponse.recommended.mandiName);
                setTrendData(trendResponse);
            } else {
                // Try real backend first
                const optResponse = await axios.post(`${API_BASE_URL}/optimize`, {
                    crop,
                    state,
                    district: city || ''
                });

                if (optResponse.data.error) {
                    setError(optResponse.data.error);
                    setRecommendation(null);
                    setPrices([]);
                    setTrendData([]);
                } else {
                    setRecommendation(optResponse.data);
                    setPrices(optResponse.data.allOptions || []);

                    // Fetch 7-day trend for recommended mandi
                    if (optResponse.data.recommended && optResponse.data.recommended.mandiName) {
                        try {
                            const trendResponse = await axios.get(`${API_BASE_URL}/trend`, {
                                params: {
                                    crop,
                                    mandi: optResponse.data.recommended.mandiName
                                }
                            });

                            const formattedTrend = trendResponse.data.reverse().map(item => ({
                                date: item.date,
                                price: item.pricePerQuintal
                            }));
                            setTrendData(formattedTrend);
                        } catch (trendError) {
                            console.error('Error fetching trend:', trendError);
                            setTrendData([]);
                        }
                    }
                }
            }

            // Ensure minimum loading time has elapsed
            const elapsed = Date.now() - startTime;
            const remainingTime = minLoadingTime - elapsed;
            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);

            // Auto-switch to mock data if backend unavailable
            if (!useMockData) {
                setError('Backend unavailable. Switching to demo mode with mock data...');
                setUseMockData(true);

                setTimeout(async () => {
                    setError('');
                    const optResponse = await MockMarketPriceService.getOptimizedRecommendation(crop, state, city);
                    setRecommendation(optResponse);
                    setPrices(optResponse.allOptions || []);
                    const trendResponse = await MockMarketPriceService.getTrendData(optResponse.recommended.mandiName);
                    setTrendData(trendResponse);
                    setLoading(false);
                }, 800);
                return;
            } else {
                setError('Unable to fetch price data.');
                setRecommendation(null);
                setPrices([]);
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-agro-green-800 via-white to-agro-green-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-agro-green-800 mb-3 flex items-center justify-center gap-3">
                        <span className="text-5xl">🌾</span>
                        Market Price Dashboard
                    </h1>
                    <p className="text-xl md:text-2xl text-agro-green-600 font-medium italic">
                        "Where should I sell my crop to earn more?"
                    </p>
                </div>

                {/* Input Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border-2 border-agro-green-200">
                    <h2 className="text-2xl font-bold text-agro-green-700 mb-6 flex items-center gap-2">
                        <span>📍</span> Select Your Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                        {/* Crop Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                                1. Crop Name
                            </label>
                            <select
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-agro-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-agro-green-200 focus:border-agro-green-500 bg-agro-green-50 font-medium text-gray-700 transition-all"
                            >
                                {crops.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* State Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                                2. State
                            </label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-agro-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-agro-green-200 focus:border-agro-green-500 bg-agro-green-50 font-medium text-gray-700 transition-all"
                            >
                                {states.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* City/District Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                                3. City/District (Optional)
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g., Indore"
                                className="w-full px-4 py-3 border-2 border-agro-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-agro-green-200 focus:border-agro-green-500 bg-agro-green-50 font-medium text-gray-700 placeholder-gray-400 transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end">
                            <button
                                onClick={fetchPrices}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-agro-green-600 to-agro-green-700 hover:from-agro-green-700 hover:to-agro-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Loading...
                                    </span>
                                ) : (
                                    '🔍 Find Best Price'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">⚠️</span>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Recommended Mandi - Hero Section */}
                {recommendation?.recommended && (
                    <div className="bg-gradient-to-r from-emerald-900 via-green-600 to-lime-500 rounded-2xl shadow-2xl p-8 md:p-10 mb-8 text-white transform hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-5xl">🎯</span>
                            <h2 className="text-3xl md:text-4xl font-bold">Best Mandi Recommendation</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/90 text-sm font-semibold mb-1">Mandi Name</p>
                                <p className="text-2xl md:text-3xl font-bold">{recommendation.recommended.mandiName}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/90 text-sm font-semibold mb-1">Price per Quintal</p>
                                <p className="text-3xl md:text-4xl font-bold">₹{recommendation.recommended.price}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/90 text-sm font-semibold mb-1">District</p>
                                <p className="text-xl md:text-2xl font-semibold">{recommendation.recommended.district}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/90 text-sm font-semibold mb-1">Optimization Score</p>
                                <p className="text-3xl md:text-4xl font-bold">{recommendation.recommended.totalScore?.toFixed(1) ?? "N/A"}<span className="text-xl">/100</span></p>
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-sm font-semibold mb-3 text-white/90">Score Breakdown:</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span>💰 Price Score (60%):</span>
                                    <span className="font-bold">{recommendation.recommended.priceScore?.toFixed(1) ?? '0.0'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>📍 Proximity Score (30%):</span>
                                    <span className="font-bold">{recommendation.recommended.proximityScore?.toFixed(1) ?? '0.0'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>📈 Trend Score (10%):</span>
                                    <span className="font-bold">{recommendation.recommended.trendScore?.toFixed(1) ?? '0.0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Price Comparison Table */}
                    {prices.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-agro-green-200">
                            <div className="bg-gradient-to-r from-agro-green-600 to-agro-green-700 px-6 py-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span>📊</span> All Mandi Prices
                                </h3>
                            </div>

                            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-agro-green-100 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-agro-green-900 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-agro-green-900 uppercase tracking-wider">
                                                Mandi Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-agro-green-900 uppercase tracking-wider">
                                                Price (₹/Quintal)
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-agro-green-900 uppercase tracking-wider">
                                                Score
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {prices.map((price, idx) => (
                                            <tr
                                                key={idx}
                                                className={`hover:bg-agro-green-50 transition-colors ${idx === 0 ? 'bg-agro-green-50' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-xl ${idx === 0 ? 'text-2xl' : ''}`}>
                                                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-semibold text-gray-900">{price.mandiName}</div>
                                                    <div className="text-sm text-gray-500">{price.district}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-2xl font-bold text-agro-green-700">
                                                        ₹{price.price}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-bold text-agro-green-600">{price.totalScore?.toFixed(1) ?? 'N/A'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 7-Day Price Trend Chart */}
                    {trendData.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-agro-green-200">
                            <h3 className="text-2xl font-bold text-agro-green-800 mb-4 flex items-center gap-2">
                                <span>📈</span> 7-Day Price Trend
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                For: <span className="font-bold text-agro-green-700">{recommendation?.recommended?.mandiName}</span>
                            </p>

                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1d5631ff" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#166534"
                                        tick={{ fill: '#166534', fontSize: 12 }}
                                        angle={-15}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        stroke="#166534"
                                        tick={{ fill: '#166534', fontSize: 12 }}
                                        label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft', fill: '#166534' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#83c18aff',
                                            border: '2px solid #22c522ff',
                                            borderRadius: '12px',
                                            padding: '10px'
                                        }}
                                        labelStyle={{ color: '#166534', fontWeight: 'bold' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#2ba316ff"
                                        strokeWidth={3}
                                        dot={{ fill: '#22c55e', r: 6, strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 8, fill: '#16a34a' }}
                                        name="Price (₹/Quintal)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                            <div className="mt-4 text-center text-sm text-gray-600">
                                {trendData.length > 1 && (
                                    <p className={`font-semibold ${trendData[trendData.length - 1].price > trendData[0].price ? 'text-green-600' : 'text-red-600'}`}>
                                        {trendData[trendData.length - 1].price > trendData[0].price ? '📈 Prices trending upward' : '📉 Prices trending downward'}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {!loading && !error && !recommendation && (
                    <div className="text-center py-16">
                        <div className="text-8xl mb-4">🌾</div>
                        <h3 className="text-2xl font-bold text-agro-green-700 mb-2">
                            Select your crop and location
                        </h3>
                        <p className="text-gray-600">
                            Get the best mandi prices and make smarter selling decisions
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketPrice;
