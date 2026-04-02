import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Catalogo from "../pages/Catalogo/Catalogo";
import Cart from "../pages/Cart/Cart";
import Profile from "../pages/Profile/Profile";
import AdminLayout from "../pages/Admin/AdminLayout";
import CategoriesManager from "../pages/Admin/CategoriesManager";
import ProductsManager from "../pages/Admin/ProductsManager";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
              <p className="text-gray-500 mt-2">Bienvenido al administrador de Abunga. Usa el menú lateral para gestionar el inventario.</p>
            </div>
          } />
          <Route path="categorias" element={<CategoriesManager />} />
          <Route path="productos" element={<ProductsManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
