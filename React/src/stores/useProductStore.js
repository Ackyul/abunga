import { create } from "zustand";
import { fetchProducts } from "../services/api";

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  visibleCount: 10,

  validateProducts: async () => {
    const { products } = get();
    if (products.length === 0) {
      await get().getProducts();
    }
  },

  getProducts: async () => {
    set({ loading: true, error: null });
    try {
      let data = await fetchProducts();
      for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }

      data = data.map((p) => {
        const tipo = p.category?.name || "Desconocido";
        const image = p.img || "/logo-abunga.png";
        
        return { ...p, tipo, image };
      });

      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  filters: {
    types: [],
    fruits: [],
  },

  setFilter: (category, value) =>
    set((state) => {
      const current = state.filters[category];
      const newFilters = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return {
        filters: {
          ...state.filters,
          [category]: newFilters,
        },
        visibleCount: 10,
      };
    }),

  getFilteredProducts: () => {
    const { products, filters } = get();
    return products.filter((product) => {
      const typeMatch =
        filters.types.length === 0 || filters.types.includes(product.tipo);

      const fruitMatch =
        filters.fruits.length === 0 || filters.fruits.includes(product.fruta);
      return typeMatch && fruitMatch;
    });
  },

  setVisibleCount: (count) =>
    set((state) => ({ visibleCount: state.visibleCount + count })),
}));

export default useProductStore;
