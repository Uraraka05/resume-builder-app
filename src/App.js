import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ResumeEdit from './pages/ResumeEdit';
import PortfolioView from './pages/PortfolioView';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/portfolio/:userId/:resumeId" element={<PortfolioView />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/resume/edit/:resumeId" element={
            <ProtectedRoute>
              <ResumeEdit />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </>
  );
}

export default App;