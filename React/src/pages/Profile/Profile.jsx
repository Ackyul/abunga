import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/navbar";

const Profile = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [isFullyLoggedIn, setIsFullyLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
       setIsFullyLoggedIn(true);
       try {
         setUser(JSON.parse(localStorage.getItem("user") || "{}"));
       } catch {
         // ignora error si el JSON es inválido
       }
    }
  }, []);

  const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     setIsFullyLoggedIn(false);
     window.location.href = "/";
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ show: false, message: "", type: "" });

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error");
      }

      setNotification({
        show: true,
        message: isLogin ? "¡Bienvenido de vuelta!" : "¡Cuenta creada correctamente! Por favor, inicia sesión.",
        type: "success"
      });

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setTimeout(() => window.location.href = "/", 1000);
      } else {
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <header className="bg-linear-to-r from-[#8ca91f] to-[#9ec425] pt-8 pb-12 flex flex-row justify-between px-4 md:justify-center items-center relative md:gap-0 shadow-sm shrink-0">
        <div className="relative md:absolute md:left-8 md:top-1/2 md:transform md:-translate-y-1/2 z-10 shrink-0">
          <Link to="/">
            <img 
              src="/logo-abunga.png" 
              alt="Abunga Logo" 
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-xl border-[3px] border-white/20 transition-transform hover:scale-105"
            />
          </Link>
        </div>
        
        <div className="z-10 hidden md:block">
           <div className="bg-white px-12 py-5 rounded-3xl shadow-md">
             <img 
               src="/abunga-text.png" 
               alt="Abunga" 
               className="h-16 object-contain"
             />
           </div>
        </div>
        
        <Navbar />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 py-12 animate-fade-in-up">
        <div className="bg-white max-w-5xl w-full rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(149,183,33,0.15)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          <div className="w-full md:w-1/2 bg-linear-to-br from-[#8ca91f] to-[#bcdb42] p-12 text-white hidden md:flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="/mision.jpg" alt="Natural" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
            </div>
            <div className="relative z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                Bienvenido a <br/> Abunga.
              </h2>
              <p className="text-lg text-white/90 font-medium leading-relaxed">
                Súmate a la comunidad y disfruta de la mejor fruta local convertida en snacks maravillosamente saludables.
              </p>
            </div>
            <div className="relative z-10 space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <p className="text-sm font-bold opacity-90 uppercase tracking-widest text-white/90">Natural • Sostenible</p>
              <div className="flex gap-2">
                <div className="w-12 h-1.5 bg-white rounded-full"></div>
                <div className="w-4 h-1.5 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
            {isFullyLoggedIn ? (
              <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in-up text-center">
                 <h3 className="text-3xl font-extrabold text-[#8ca91f] tracking-tight">
                   Mi Perfil
                 </h3>
                 <p className="text-gray-500 mt-2 font-medium">
                   Gestiona tu cuenta y cierra sesión.
                 </p>
                 <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl shadow-sm text-left">
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Nombre</p>
                    <p className="text-xl text-gray-800 font-extrabold mb-4">{user?.name || "---"}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Correo Electrónico</p>
                    <p className="text-lg text-gray-800 font-medium mb-4">{user?.email || "---"}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Tipo de Cuenta</p>
                    <p className="text-lg text-[#8ca91f] font-black">{user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
                 </div>
                 
                 <button 
                  onClick={handleLogout}
                  className="w-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-sm"
                 >
                   Cerrar Sesión
                 </button>
              </div>
            ) : (
              <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-extrabold text-[#8ca91f] tracking-tight">
                  {isLogin ? "Iniciar Sesión" : "Crea tu Cuenta"}
                </h3>
                <p className="text-gray-500 mt-2 font-medium">
                  {isLogin ? "¡Qué bueno verte de nuevo!" : "Únete a nuestro lado más natural 💚"}
                </p>
              </div>

              {notification.show && (
                <div className={`p-4 rounded-xl font-bold text-center ${notification.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'} animate-fade-in`}>
                  {notification.message}
                </div>
              )}

              <form className="space-y-5 flex flex-col" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Juan Pérez"
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#8ca91f] focus:border-transparent transition-all shadow-xs text-gray-800 font-medium placeholder:text-gray-400"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#8ca91f] focus:border-transparent transition-all shadow-xs text-gray-800 font-medium placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Contraseña</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#8ca91f] focus:border-transparent transition-all shadow-xs text-gray-800 font-medium placeholder:text-gray-400"
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-end animate-fade-in">
                    <a href="#" className="text-sm font-bold text-[#8ca91f] hover:text-[#768f18] transition-colors">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-linear-to-r mt-4 from-[#9ec425] to-[#8ca91f] text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(149,183,33,0.5)] transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#e24052] hover:to-[#cd384e]'}`}
                >
                  {isLoading ? "Cargando..." : (isLogin ? "Ingresar a mi cuenta" : "Crear mi cuenta")}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-gray-100 pt-8">
                <p className="text-gray-600 font-medium">
                  {isLogin ? "¿No tienes una cuenta aún?" : "¿Ya tienes una cuenta?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 font-extrabold text-[#8ca91f] hover:text-[#768f18] transition-colors focus:outline-hidden"
                  >
                    {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                  </button>
                </p>
              </div>

              </div>
            )}
            </div>
          </div>
      </main>
    </div>
  );
};

export default Profile;
