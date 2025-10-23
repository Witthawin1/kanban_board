import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard';
import Board from './pages/Board';
import BoardForm from './pages/BoardForm';
import './App.css'
import './index.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/board/:board_id" element={<Board />} />
        <Route path="/board/new" element={<BoardForm />} />
        <Route path="/board/edit/:board_id" element={<BoardForm />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;