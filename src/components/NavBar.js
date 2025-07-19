import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { auth } from "../features/auth/firebase";
import toast from 'react-hot-toast';

function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo/Brand */}
          <div className="flex-shrink-0">
            <span className="font-bold text-xl text-gray-800">Resume Builder</span>
          </div>

          {/* Right side: User info and Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
