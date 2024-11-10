import { useAuth } from "../../providers/AuthProvider";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, username } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="container mx-auto py-4 border-b-2 border-slate-100 flex justify-between items-center px-4 md:px-0">
      <div className="font-bold">Grapevine <span className="font-light">{isAuthenticated && `/ ${username}`}</span></div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:block">
        {isAdmin && <Link
          to="/accounts"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Manage Accounts
        </Link>}
        {isAuthenticated && <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-rose-700 hover:text-rose-900"
        >
          Sign Out
        </button>}
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 w-48 py-2 bg-white rounded-md shadow-xl z-20 md:hidden">
          {isAdmin && (
            <Link
              to="/accounts"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Manage Accounts
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleSignOut();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-rose-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;