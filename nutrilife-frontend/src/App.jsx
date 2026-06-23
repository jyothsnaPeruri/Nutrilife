import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MealTracker from './pages/MealTracker'
import WaterTracker from './pages/WaterTracker'
import WorkoutTracker from './pages/WorkoutTracker'
import NutritionGoals from './pages/NutritionGoals'
import Community from './pages/Community'
import WeeklyReport from './pages/WeeklyReport'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/meals" element={<PrivateRoute><MealTracker /></PrivateRoute>} />
        <Route path="/water" element={<PrivateRoute><WaterTracker /></PrivateRoute>} />
        <Route path="/workout" element={<PrivateRoute><WorkoutTracker /></PrivateRoute>} />
        <Route path="/goals" element={<PrivateRoute><NutritionGoals /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><WeeklyReport /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}