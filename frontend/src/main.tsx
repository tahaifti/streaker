import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import { AuthProvider } from './utils/auth.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<App />} />
          <Route path='/' element={<Navigate to='/home' />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
