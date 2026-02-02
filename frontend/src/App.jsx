

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Recommendations from './components/Recommendations'
import CropCalendar from './components/CropCalendar'
import FAQ from './components/FAQ'
import MarketPrice from './components/MarketPrice'
import Navbar from './components/Navbar'
import Login from './components/auth/Login'
import WeatherBackground from './components/WeatherBackground'
import { WeatherProvider } from './context/WeatherContext'
import { AuthProvider, useAuth } from './context/AuthProvider'

console.log("App rendered");

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoaded } = useAuth();
  if (!isLoaded) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Inner App component that consumes Auth Context
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/calendar/:cropId" element={<ProtectedRoute><CropCalendar /></ProtectedRoute>} />
        <Route path="/crop-calendar" element={<ProtectedRoute><CropCalendar /></ProtectedRoute>} />
        <Route path="/market-prices" element={<ProtectedRoute><MarketPrice /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <WeatherBackground />
          <AppContent />
        </Router>
      </WeatherProvider>
    </AuthProvider>
  )
}

export default App
