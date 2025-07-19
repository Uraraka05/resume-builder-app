// Create this new file at: src/pages/AuthPage.js
// You can then DELETE Login.js and SignUp.js

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../features/auth/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import toast from 'react-hot-toast';

// This is the new, combined component for both Login and Sign Up.
function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // This effect checks the URL path to decide which form to show initially.
  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsLoginView(false);
    } else {
      setIsLoginView(true);
    }
  }, [location.pathname]);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const action = isLoginView 
      ? signInWithEmailAndPassword(auth, email, password)
      : createUserWithEmailAndPassword(auth, email, password);

    try {
      await action;
      if (!isLoginView) {
        toast.success("Account created successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    // You can also update the URL here if you want
    // navigate(isLoginView ? '/signup' : '/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden">
        {/* Left Panel - Image */}
        <div 
          className="hidden md:block w-1/2 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${isLoginView ? 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop'})` }}
        >
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white">
          {/* We use a key here to force React to re-render the component on view change, triggering the animation */}
          <div key={isLoginView ? 'login' : 'signup'} className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
            </h1>
            <p className="text-gray-600 mb-8">
              {isLoginView ? 'Log in to manage your resumes.' : 'Get started with your professional resume today.'}
            </p>
            
            <form onSubmit={handleAuthAction} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input
                  type="email" required placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="border p-3 rounded w-full transition duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                <input
                  type="password" required placeholder={isLoginView ? '••••••••' : 'Minimum 6 characters'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="border p-3 rounded w-full transition duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : (isLoginView ? 'Log In' : 'Sign Up')}
              </button>
            </form>
            
            <p className="text-center text-gray-600 mt-8">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={toggleView} className="text-blue-600 font-semibold hover:underline">
                {isLoginView ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthPage;
