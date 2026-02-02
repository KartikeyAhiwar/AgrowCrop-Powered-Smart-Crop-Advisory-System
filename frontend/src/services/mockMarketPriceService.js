// Mock Market Price Data Service
// Use this for testing the UI without backend running

export const mockMandiData = {
    "Madhya Pradesh": {
        districts: ["Indore", "Ujjain", "Dewas", "Bhopal", "Gwalior"],
        crops: {
            Wheat: [
                { mandiName: "Ujjain Mandi", district: "Ujjain", price: 2180, score: 89.5, priceScore: 98.2, proximityScore: 100, trendScore: 75 },
                { mandiName: "Indore Mandi", district: "Indore", price: 2150, score: 85.2, priceScore: 96.8, proximityScore: 100, trendScore: 50 },
                { mandiName: "Bhopal Mandi", district: "Bhopal", price: 2170, score: 82.1, priceScore: 97.7, proximityScore: 50, trendScore: 100 },
                { mandiName: "Dewas Mandi", district: "Dewas", price: 2100, score: 76.4, priceScore: 94.6, proximityScore: 50, trendScore: 75 },
                { mandiName: "Gwalior Mandi", district: "Gwalior", price: 2090, score: 74.8, priceScore: 94.1, proximityScore: 50, trendScore: 50 }
            ],
            Rice: [
                { mandiName: "Indore Mandi", district: "Indore", price: 2850, score: 88.3, priceScore: 98.3, proximityScore: 100, trendScore: 50 },
                { mandiName: "Bhopal Mandi", district: "Bhopal", price: 2900, score: 86.5, priceScore: 100, proximityScore: 50, trendScore: 75 },
                { mandiName: "Ujjain Mandi", district: "Ujjain", price: 2820, score: 82.7, priceScore: 97.2, proximityScore: 50, trendScore: 100 }
            ]
        }
    },
    "Maharashtra": {
        districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Solapur"],
        crops: {
            Cotton: [
                { mandiName: "Akola Mandi", district: "Nagpur", price: 6600, score: 91.2, priceScore: 99.2, proximityScore: 100, trendScore: 75 },
                { mandiName: "Pune Mandi", district: "Pune", price: 6580, score: 88.5, priceScore: 98.9, proximityScore: 100, trendScore: 50 },
                { mandiName: "Nashik Mandi", district: "Nashik", price: 6520, score: 85.1, priceScore: 98.0, proximityScore: 50, trendScore: 100 }
            ]
        }
    },
    "Punjab": {
        districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
        crops: {
            Wheat: [
                { mandiName: "Ludhiana Mandi", district: "Ludhiana", price: 2220, score: 92.1, priceScore: 100, proximityScore: 100, trendScore: 75 },
                { mandiName: "Amritsar Mandi", district: "Amritsar", price: 2200, score: 88.3, priceScore: 99.1, proximityScore: 50, trendScore: 100 },
                { mandiName: "Patiala Mandi", district: "Patiala", price: 2180, score: 84.7, priceScore: 98.2, proximityScore: 50, trendScore: 75 }
            ]
        }
    }
};

export const mockTrendData = {
    "Ujjain Mandi": [
        { date: "2026-01-17", price: 2100 },
        { date: "2026-01-18", price: 2110 },
        { date: "2026-01-19", price: 2130 },
        { date: "2026-01-20", price: 2145 },
        { date: "2026-01-21", price: 2160 },
        { date: "2026-01-22", price: 2170 },
        { date: "2026-01-23", price: 2180 }
    ],
    "Indore Mandi": [
        { date: "2026-01-17", price: 2140 },
        { date: "2026-01-18", price: 2145 },
        { date: "2026-01-19", price: 2148 },
        { date: "2026-01-20", price: 2150 },
        { date: "2026-01-21", price: 2150 },
        { date: "2026-01-22", price: 2150 },
        { date: "2026-01-23", price: 2150 }
    ],
    "Bhopal Mandi": [
        { date: "2026-01-17", price: 2120 },
        { date: "2026-01-18", price: 2130 },
        { date: "2026-01-19", price: 2145 },
        { date: "2026-01-20", price: 2155 },
        { date: "2026-01-21", price: 2165 },
        { date: "2026-01-22", price: 2170 },
        { date: "2026-01-23", price: 2170 }
    ]
};

// Mock API service
export class MockMarketPriceService {
    static async getOptimizedRecommendation(crop, state, district = '') {
        await this.delay(700);

        const stateData = mockMandiData[state];
        if (!stateData) {
            // Fallback: Generate generic data for any state
            return this.generateFallbackData(crop, state, district);
        }

        const cropData = stateData.crops[crop];
        if (!cropData) {
            // Fallback: Generate generic data for this crop in this state
            return this.generateFallbackData(crop, state, district);
        }

        // Filter by district if specified
        let filteredData = cropData;
        if (district) {
            const filtered = cropData.filter(m =>
                m.district.toLowerCase() === district.toLowerCase()
            );

            // If district match found, boost proximity score
            if (filtered.length > 0) {
                filteredData = cropData.map(m => ({
                    ...m,
                    proximityScore: m.district.toLowerCase() === district.toLowerCase() ? 100 : 50,
                    score: (m.priceScore * 0.6) +
                        ((m.district.toLowerCase() === district.toLowerCase() ? 100 : 50) * 0.3) +
                        (m.trendScore * 0.1)
                })).sort((a, b) => b.score - a.score);
            }
        }

        return {
            recommended: filteredData[0],
            allOptions: filteredData,
            crop,
            state
        };
    }

    static generateFallbackData(crop, state, district = '') {
        // Generate 5 generic mandis with realistic prices
        const basePrice = {
            'Wheat': 2100, 'Rice': 2800, 'Cotton': 6500, 'Soybean': 4200,
            'Maize': 1800, 'Bajra': 2200, 'Jowar': 2000, 'Tur': 6800,
            'Groundnut': 5500, 'Onion': 1200, 'Potato': 800, 'Tomato': 1500,
            'Sugarcane': 320, 'Mustard': 5300, 'Sunflower': 6200, 'Moong': 7200,
            'Urad': 6900, 'Chana': 5100, 'Arhar': 6500, 'Masoor': 5800,
            'Sesame': 10500, 'Castor': 6400
        }[crop] || 2000;

        let districts = [];
        if (district) {
            districts = [district];
        } else {
            // Realistic fallback districts based on state
            const stateDistricts = {
                "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Sagar"],
                "Maharashtra": ["Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
                "Uttar Pradesh": ["Kanpur", "Lucknow", "Agra", "Varanasi", "Prayagraj"],
                "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
                "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
                "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer"],
                "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Karnal"],
                "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruehm"],
                "Karnataka": ["Bangalore", "Mysore", "Hubli", "Belgaum", "Mangalore"]
            };
            // Default list if state not found
            districts = stateDistricts[state] || ["Central City", "North City", "South City", "East City", "Capital City"];
        }

        const mandis = districts.map((dist, index) => {
            const priceVariation = (Math.random() - 0.5) * 200; // ±100
            const price = Math.round(basePrice + priceVariation);
            const priceScore = 90 + (index * 2);
            const proximityScore = index === 0 ? 100 : 50 + Math.random() * 30;
            const trendScore = 60 + Math.random() * 40;
            const score = (priceScore * 0.6) + (proximityScore * 0.3) + (trendScore * 0.1);

            return {
                mandiName: `${dist} Mandi`,
                district: dist,
                price,
                score: Math.round(score * 10) / 10,
                priceScore,
                proximityScore,
                trendScore
            };
        }).sort((a, b) => b.score - a.score);

        return {
            recommended: mandis[0],
            allOptions: mandis,
            crop,
            state
        };
    }

    static async getTrendData(mandiName) {
        await this.delay(500);
        return mockTrendData[mandiName] || mockTrendData["Indore Mandi"];
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
