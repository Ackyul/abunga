import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { cn } from "../lib/utils";
import { toast } from 'sonner';

import { ProductModal } from "./product-modal";
import useCartStore from "../stores/useCartStore";

function ProductCard({ product }) {
  const [selectedWeight, setSelectedWeight] = useState("50gr");
  const [prevProduct, setPrevProduct] = useState(product);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, cart, updateQuantity, removeFromCart } = useCartStore();

  if (product?.id !== prevProduct?.id) {
    setPrevProduct(product);
    setSelectedWeight(product?.variants?.length > 0 ? product.variants[0].weight : "50gr");
  }

  if (!product) return null;

  const getPrice = () => {
    if (product.variants?.length > 0) {
        const variant = product.variants.find(v => v.weight === selectedWeight);
        if (variant) return variant.price;
    }
    if (product.tipo.includes("Láminas")) {
        return 10;
    }
    return product.precio;
  };

  const displayPrice = getPrice();

  const cartItem = cart.find(
    (item) => item.id === product.id && item.selectedWeight === selectedWeight
  );

  const handleAddToCart = (e) => {
      e.stopPropagation();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Por favor, inicia sesión en 'Cuenta' para empezar a comprar.");
        return;
      }
      addToCart({
          id: product.id,
          name: product.name,
          image: product.image,
          price: displayPrice,
          brand: product.brand
      }, 1, selectedWeight);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
       toast.warning("Por favor, inicia sesión para añadir más al carrito.");
       return;
    }
    updateQuantity(product.id, selectedWeight, cartItem.quantity + 1);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    if (cartItem.quantity > 1) {
      updateQuantity(product.id, selectedWeight, cartItem.quantity - 1);
    } else {
      removeFromCart(product.id, selectedWeight);
    }
  };


  return (
    <>
      <Card 
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden hover:-translate-y-1 transition-transform bg-white"
      >
        <CardContent className="p-4 flex flex-col h-full">
          <div className="h-28 md:h-48 w-full flex items-center justify-center mb-4 bg-white rounded-xl">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
          <div className="mt-auto space-y-2">
              <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">{product.brand}</p>
              <h3 className="font-bold text-sm md:text-lg leading-tight line-clamp-2 min-h-[2.5em]">{product.name}</h3>
              {product.variants?.length > 0 && (
                <div className="flex flex-wrap gap-1 md:gap-2 my-2 w-full">
                  {product.variants.map((v) => (
                    <button 
                      key={v.weight}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWeight(v.weight);
                      }}
                      className={cn(
                        "py-1 px-2 text-[10px] md:text-xs font-bold rounded-md border transition-all whitespace-nowrap flex-1",
                        selectedWeight === v.weight
                        ? "border-[#95b721] bg-[#95b721] text-white shadow-sm" 
                        : "border-gray-200 text-gray-500 hover:border-[#95b721] hover:text-[#95b721]"
                      )}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xl md:text-3xl font-black text-[#95b721]">S/ {displayPrice}</p>
              
              {cartItem ? (
                 <div className="flex items-center justify-between bg-gray-100 rounded-full p-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={handleDecrease}
                        className="h-8 w-8 flex items-center justify-center bg-white rounded-full shadow-sm font-bold hover:bg-gray-50 text-black"
                    >
                        -
                    </button>
                    <span className="font-bold text-lg">{cartItem.quantity}</span>
                     <button 
                        onClick={handleIncrease}
                        className="h-8 w-8 flex items-center justify-center bg-white rounded-full shadow-sm font-bold hover:bg-gray-50 text-black"
                    >
                        +
                    </button>
                 </div>
              ) : (
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white font-bold py-2 rounded-xl text-xs md:text-sm hover:bg-gray-800 transition-colors"
                >
                    Añadir
                </button>
              )}
          </div>
        </CardContent>
      </Card>
      
      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={setIsModalOpen} 
      />
    </>
  );
}

export default ProductCard;
