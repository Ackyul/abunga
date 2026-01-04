import { Navbar } from "../../components/navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#95b721] pt-8 pb-12 flex flex-row justify-between px-4 md:justify-center items-center relative md:gap-0">
        <div className="relative md:absolute md:left-8 md:top-1/2 md:transform md:-translate-y-1/2 z-10 shrink-0">
          <img 
            src="/logo-abunga.png" 
            alt="Abunga Logo" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg"
          />
        </div>

        <div className="z-10">
          <div className="bg-white px-12 py-5 rounded-3xl shadow-md hidden md:block">
            <img 
              src="/abunga-text.png" 
              alt="Abunga" 
              className="h-16 object-contain hidden md:block"
            />
          </div>
        </div>
        
        <Navbar />
        
        <div className="absolute bottom-0 left-0 right-0 flex flex-col">
          <div className="h-2 bg-[#e24052]"></div>
          <div className="h-2 bg-[#d08635]"></div>
          <div className="h-2 bg-[#e3c561]"></div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#95b721] mb-8">Somos:</h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Una marca arequipeña que transforma fruta local en snacks deshidratados y rollitos saludables 💚
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Natural, sostenible y hecho con propósito
            </p>
            <div className="pt-8">
              <p className="text-2xl font-semibold text-gray-800">
                Contactos al 📞: <a href="tel:973391928" className="text-[#95b721] hover:underline">973391928</a>
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
            <img src="/frutas-home.jpg" alt="Fruta Deshidratada" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:order-2">
            <h2 className="text-4xl font-bold text-[#95b721] mb-8">Nuestra Misión</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hacer "retumbar" a los paladares arequipeños con snacks saludables, prácticos y de alta calidad elaborados a base de frutas deshidratadas y sus derivados, en constante innovación, promoviendo hábitos de consumo natural con responsabilidad social y medioambiental, fomentando la economía circular.
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center md:order-1">
            <img src="/mision.jpg" alt="Misión Abunga" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-[#95b721] mb-8">Nuestra Visión</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ser la marca líder en snacks saludables a base de frutas deshidratadas a nivel nacional reconocida por su innovación, calidad y compromiso con la alimentación, la salud y el medioambiente.
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
            <img src="/vision.jpg" alt="Visión Abunga" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        <div className="text-center py-12">
          <h2 className="text-4xl font-bold text-[#95b721] mb-8">Mira nuestro catálogo aquí</h2>
          <Link 
            to="/catalogo" 
            onClick={() => window.scrollTo(0, 0)}
            className="inline-block bg-[#95b721] text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-[#e24052] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Ver Catálogo
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
