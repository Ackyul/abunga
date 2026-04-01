import { Link, useLocation } from "react-router-dom";
// import { ShoppingCart } from "lucide-react";
// import useCartStore from "../stores/useCartStore";
import { cn } from "../lib/utils";

export function Navbar() {
  const location = useLocation();
  // const itemsCount = useCartStore((state) => state.getItemsCount());

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
      
      {/* Cart button removed as per request */}
    </div>
  );
}
