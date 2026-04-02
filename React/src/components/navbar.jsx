import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import useCartStore from "../stores/useCartStore";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";

export function Navbar() {
  const location = useLocation();
  const itemsCount = useCartStore((state) => state.getItemsCount());
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role);
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/catalogo", label: "Catálogo" },
  ];

  if (!isLoggedIn) {
    navLinks.push({ path: "/profile", label: "Cuenta" });
  }

  return (
    <div className="relative md:absolute md:right-8 md:top-1/2 md:transform md:-translate-y-1/2 flex items-center gap-2 md:gap-4">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            "px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 uppercase tracking-wider",
            location.pathname === link.path
              ? "bg-white/95 text-[#95b721] shadow-lg shadow-black/10 backdrop-blur-sm"
              : "text-white/90 hover:text-white hover:bg-white/20 hover:shadow-sm"
          )}
        >
          {link.label}
        </Link>
      ))}
      
      {isLoggedIn && (
        <div className="flex items-center gap-3 ml-2">
           <Link
            to="/cart"
            className="relative p-2 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>

          {userRole === 'ADMIN' && (
            <Link
              to="/admin"
              className="px-3 py-1.5 md:px-4 md:py-2 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 mr-1 shadow-sm"
            >
              Admin
            </Link>
          )}

          <Link
            to="/profile"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 overflow-hidden shadow-lg border-2 border-white/50 hover:border-white transition-all duration-300"
          >
            <User size={24} strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
