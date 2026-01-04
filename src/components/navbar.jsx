import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import useCartStore from "../stores/useCartStore";
import { cn } from "../lib/utils";

export function Navbar() {
  const location = useLocation();
  const itemsCount = useCartStore((state) => state.getItemsCount());

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/catalogo", label: "Catálogo" },
  ];

  return (
    <div className="relative md:absolute md:right-8 md:top-1/2 md:transform md:-translate-y-1/2 flex items-center gap-2 md:gap-4">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            "px-3 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-lg transition-all uppercase",
            location.pathname === link.path
              ? "bg-white text-[#95b721] shadow-md"
              : "text-white hover:bg-white/20"
          )}
        >
          {link.label}
        </Link>
      ))}
      
      <Link 
        to="/cart" 
        className="bg-white p-3 rounded-full shadow-md border-4 border-white hover:bg-gray-50 hover:scale-105 transition-all relative"
      >
        <ShoppingCart className="h-6 w-6 text-[#95b721]" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white">
            {itemsCount}
          </span>
        )}
      </Link>
    </div>
  );
}
