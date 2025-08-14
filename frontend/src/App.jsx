import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminSetup from './components/AdminSetup';
import VotingInterface from './components/VotingInterface';
import LiveResults from './components/LiveResults';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // Add theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme;
    document.body.className = savedTheme;
  }, []);
  return (
    <Router>
      <div className="min-h-screen">
        <header className="bg-testio-blue text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Two Truths & A Lie - Test IO</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<AdminSetup />} />
            <Route path="/admin" element={<AdminSetup />} />
            <Route path="/vote/:gameId" element={<VotingInterface />} />
            <Route path="/results/:gameId" element={<LiveResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
