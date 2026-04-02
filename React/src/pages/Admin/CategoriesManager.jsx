import { useState, useEffect } from "react";
import { CopyPlus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";

const CategoriesManager = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (e) {
            console.error("Error al cargar categorias", e);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/categories`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name })
            });
            if (res.ok) {
                setName("");
                await fetchCategories();
            }
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
        try {
            const res = await fetch(`${apiUrl}/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                await fetchCategories();
            }
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Administrar Categorías</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-xl mb-8">
                <h2 className="text-xl font-semibold mb-4">Añadir Categoría</h2>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Frutas, Láminas" 
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#95b721]"
                    />
                    <Button type="submit" disabled={isLoading} className="bg-[#95b721] hover:bg-[#84a31d] text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2">
                        <CopyPlus size={18} />
                        Añadir
                    </Button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 max-w-3xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">ID</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Nombre</th>
                            <th className="text-right px-6 py-4 font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-gray-500">#{c.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(c.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                    No hay categorías registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesManager;
