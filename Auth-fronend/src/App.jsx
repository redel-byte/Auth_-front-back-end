import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import ProtectedRoute from "./Auth/ProtectedRoutes"
import { HomePage } from './pages/HomePage';
import PublicRoutes from './Auth/PublicRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/login' element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        } />
        <Route path='/register' element={
          <PublicRoutes>
            <Register />
          </PublicRoutes>
        } />
        {/* <Route path="/me" element={
          <ProtectedRoute>
            <me />
          </ProtectedRoute>
        } /> */}

        <Route path='/' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
