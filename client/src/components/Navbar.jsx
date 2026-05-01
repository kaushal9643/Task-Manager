import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  const authPages = ["/", "/register"];
  const isAuthPage = authPages.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-800 text-white shadow-2xl">
      <Link to={token ? "/dashboard" : "/"} className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
        TASKLY
      </Link>

      {/* Only show links if the user is logged in AND not on login/register pages */}
      {!isAuthPage && token && (
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors font-medium">Dashboard</Link>
          <Link to="/projects" className="text-gray-300 hover:text-white transition-colors font-medium">Projects</Link>

          <button
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 px-4 py-1.5 rounded-lg transition-all text-sm font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
} 