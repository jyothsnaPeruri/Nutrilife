import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MealTracker from './pages/MealTracker'
import WaterTracker from './pages/WaterTracker'
import WorkoutTracker from './pages/WorkoutTracker'
import NutritionGoals from './pages/NutritionGoals'
import Community from './pages/Community'
import WeeklyReport from './pages/WeeklyReport'

const hasToken = () => Boolean(localStorage.getItem('token'))

function Private({ title, children }) {
  return hasToken() ? <Layout title={title}>{children}</Layout> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={hasToken() ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={hasToken() ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/dashboard" element={<Private title="Dashboard"><Dashboard /></Private>} />
        <Route path="/meals" element={<Private title="Meals"><MealTracker /></Private>} />
        <Route path="/water" element={<Private title="Water"><WaterTracker /></Private>} />
        <Route path="/workout" element={<Private title="Workouts"><WorkoutTracker /></Private>} />
        <Route path="/goals" element={<Private title="Goals"><NutritionGoals /></Private>} />
        <Route path="/community" element={<Private title="Community"><Community /></Private>} />
        <Route path="/reports" element={<Private title="Weekly AI Report"><WeeklyReport /></Private>} />
        <Route path="*" element={<Navigate to={hasToken() ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
