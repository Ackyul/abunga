import { useState, useEffect } from "react";
import { CopyPlus, Trash2, Pencil } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const ProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [fruta, setFruta] = useState("");
    const [img, setImg] = useState("");
    const [categoryId, setCategoryId] = useState("");
    
    const [editingId, setEditingId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [variants, setVariants] = useState([]);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchInitialData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${apiUrl}/api/products`),
                fetch(`${apiUrl}/api/categories`)
            ]);
            if (prodRes.ok) setProducts(await prodRes.json());
            if (catRes.ok) setCategories(await catRes.json());
        } catch (e) {
            console.error("Error al cargar datos", e);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const resetForm = () => {
        setName(""); setPrice(""); setFruta(""); setImg(""); setCategoryId(""); setEditingId(null); setVariants([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || (!price && variants.length === 0) || !categoryId) {
            return toast.error("Nombre, Categoría, y al menos un Precio son obligatorios.");
        }
        
        setIsLoading(true);
        const payload = {
            name,
            price: price ? parseFloat(price) : 0,
            fruta,
            img,
            categoryId: parseInt(categoryId),
            variants: variants.length > 0 ? variants.map(v => ({ weight: v.weight, price: parseFloat(v.price) })) : null
        };

        try {
            const url = editingId ? `${apiUrl}/api/products/${editingId}` : `${apiUrl}/api/products`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                resetForm();
                await fetchInitialData();
            }
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (p) => {
        setEditingId(p.id);
        setName(p.name);
        setPrice(p.price);
        setFruta(p.fruta || "");
        setImg(p.img || "");
        setCategoryId(p.categoryId || "");
        setVariants(p.variants || []);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            const res = await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                await fetchInitialData();
            }
        } catch(e) {
            console.error(e);
        }
    };

    const addVariant = () => setVariants([...variants, { weight: "", price: "" }]);
    const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsUploading(true);
        try {
            const res = await fetch(`${apiUrl}/api/upload`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setImg(data.url);
            } else {
                toast.error("Error al subir la imagen.");
            }
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            toast.error("Error de conexión al intentar subir la imagen.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Administrar Productos</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#95b721] focus:outline-hidden" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Precio Base {variants.length > 0 ? "(Opcional si hay variantes)" : "(S/)"}</label>
                        <input type="number" step="0.1" value={price} onChange={(e) => setPrice(e.target.value)} required={variants.length === 0} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#95b721] focus:outline-hidden" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Categoría (Aparecerá en el tipo)</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#95b721] focus:outline-hidden bg-white">
                            <option value="">Selecciona...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Fruta (Sabor principal)</label>
                        <input type="text" value={fruta} onChange={(e) => setFruta(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#95b721] focus:outline-hidden" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Imagen del Producto</label>
                        <div className="flex flex-col gap-2">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#95b721]/10 file:text-[#95b721] hover:file:bg-[#95b721]/20 cursor-pointer" disabled={isUploading} />
                            {isUploading && <span className="text-sm text-blue-500 font-medium">Subiendo imagen... Espere.</span>}
                            <input type="text" value={img} onChange={(e) => setImg(e.target.value)} placeholder="...o también puedes pegar una URL aquí" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#95b721] focus:outline-hidden text-sm" />
                        </div>
                    </div>

                    <div className="col-span-full border border-gray-200 p-4 rounded-lg bg-gray-50/50 mt-2">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-bold text-gray-700">Variantes (Pesos y Precios)</label>
                            <Button type="button" onClick={addVariant} className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-3 py-1 rounded-lg">
                                + Añadir Variante
                            </Button>
                        </div>
                        {variants.length === 0 && <p className="text-xs text-gray-500 italic mb-2">Si no añades variantes, el producto usará el precio base general de S/ {price || "0"}.</p>}
                        {variants.map((v, i) => (
                            <div key={i} className="flex gap-2 mb-2 items-center bg-white p-2 border border-gray-100 rounded-lg shadow-sm">
                                <input type="text" value={v.weight} onChange={(e) => updateVariant(i, 'weight', e.target.value)} placeholder="Peso (ej. 50gr, 1kg)" className="w-1/2 px-3 py-1.5 border border-gray-200 rounded focus:ring-2 focus:ring-[#95b721] focus:outline-hidden text-sm" required />
                                <input type="number" step="0.1" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)} placeholder="Precio (S/)" className="w-1/2 px-3 py-1.5 border border-gray-200 rounded focus:ring-2 focus:ring-[#95b721] focus:outline-hidden text-sm" required />
                                <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="col-span-full flex justify-end gap-2 mt-4">
                        {editingId && (
                            <Button type="button" onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg">
                                Cancelar
                            </Button>
                        )}
                        <Button type="submit" disabled={isLoading || isUploading} className="bg-[#95b721] hover:bg-[#84a31d] text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2">
                            <CopyPlus size={18} />
                            {editingId ? 'Guardar Cambios' : 'Añadir Producto'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Img</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Nombre</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Categoría</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Fruta</th>
                            <th className="text-left px-6 py-4 font-semibold text-gray-600">Precio</th>
                            <th className="text-right px-6 py-4 font-semibold text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    {p.img ? <img src={p.img} alt={p.name} className="w-10 h-10 object-contain rounded bg-gray-50" /> : <div className="w-10 h-10 bg-gray-100 rounded"></div>}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                                <td className="px-6 py-4 text-gray-600">{p.category?.name || '---'}</td>
                                <td className="px-6 py-4 text-gray-600">{p.fruta || '---'}</td>
                                <td className="px-6 py-4 font-bold text-[#95b721]">S/ {p.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2">
                                        <Pencil size={20} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductsManager;
