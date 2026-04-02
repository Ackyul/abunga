export const fetchProducts = async () => {
  const url = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/products` : "http://localhost:3000/api/products";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Error al cargar los productos");
  }
  return await response.json();
};
