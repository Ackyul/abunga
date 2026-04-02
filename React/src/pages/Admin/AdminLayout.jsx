import { Link, Outlet, useLocation } from "react-router-dom";
import { CopyPlus, Boxes, LayoutDashboard, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const AdminLayout = () => {
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUserRole(user.role);
        } catch (e) {
            setUserRole(null);
        }
    }, []);

    if (userRole !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Acceso Denegado</h1>
                    <p className="text-gray-600 mb-6">No tienes permisos para ver esta página.</p>
                    <Link to="/" className="text-[#95b721] font-bold hover:underline">Volver al Inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col shrink-0">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <img src="/logo-abunga.png" alt="Logo" className="w-10 h-10 rounded-full" />
                    <span className="font-bold text-xl text-gray-800">Admin</span>
                </div>
                
                <nav className="p-4 space-y-2 flex-grow">
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/admin' ? 'bg-[#95b721]/10 text-[#95b721]' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <LayoutDashboard size={20} />
                        Resumen
                    </Link>
                    <Link to="/admin/categorias" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname.includes('/admin/categorias') ? 'bg-[#95b721]/10 text-[#95b721]' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Boxes size={20} />
                        Categorías
                    </Link>
                    <Link to="/admin/productos" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname.includes('/admin/productos') ? 'bg-[#95b721]/10 text-[#95b721]' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <CopyPlus size={20} />
                        Productos
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
                        <ArrowLeft size={16} />
                        Salir al sitio web
                    </Link>
                </div>
            </aside>

            {/* Content area */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
