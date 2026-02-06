import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import AboutPage from './pages/AboutPage';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 right-4 z-50">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-white p-2 rounded-lg shadow-md border border-slate-200 text-slate-600"
            >
                {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
        </div>

        {/* Sidebar Container */}
        <div className={`
            fixed md:relative z-40 h-full transition-transform duration-300 transform
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            <Sidebar />
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Main Content */}
        <main className="flex-1 h-full overflow-hidden relative w-full">
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;