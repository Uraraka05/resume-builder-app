import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="p-10 bg-white rounded shadow space-y-4">
        <h1 className="text-3xl font-bold text-center">Resume Portfolio App</h1>
        <p className="text-center text-lg text-gray-600">Create beautiful resumes and portfolios with ease!</p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          <Link to="/login" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
