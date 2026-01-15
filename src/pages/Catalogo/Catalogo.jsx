import { MobileFilters } from "../../components/mobile-filters";
import Products from "../../components/products";
import ProductCard from "../../components/product-card";
import { SidebarFilters } from "../../components/sidebar-filters";
import { Navbar } from "../../components/navbar";

const Catalogo = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#95b721] pt-8 pb-12 md:pt-14 md:pb-12 flex flex-row justify-between px-4 md:justify-center items-center relative md:gap-4">
        <div className="relative md:absolute md:left-8 md:top-1/2 md:transform md:-translate-y-1/2 z-10 shrink-0">
          <img 
            src="/logo-abunga.png" 
            alt="Abunga Logo" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg"
          />
        </div>

        <div className="z-10 hidden md:block">
          <div className="bg-transparent md:bg-white px-0 md:px-12 py-0 md:py-5 rounded-none md:rounded-3xl shadow-none md:shadow-md border-0 md:border-2 border-black/10">
            <h1 className="text-3xl font-bold tracking-wider text-white md:text-black uppercase">Catálogo</h1>
          </div>
        </div>
        
        <Navbar />

        <div className="absolute bottom-0 left-0 right-0 flex flex-col">
          <div className="h-2 bg-[#e24052]"></div>
          <div className="h-2 bg-[#d08635]"></div>
          <div className="h-2 bg-[#e3c561]"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:hidden">
            <MobileFilters />
          </div>
          <div className="hidden md:block">
            <SidebarFilters />
          </div>
          <div className="flex-1">
            <Products />
          </div>
          <div className="hidden xl:block w-96 shrink-0">
             <div className="sticky top-24">
                <h3 className="text-xl font-bold text-[#95b721] mb-6 text-center">¡Nuevo Mix!</h3>
                <ProductCard 
                    product={{
                        id: "mixtos-especial",
                        name: "Mix de Frutas Deshidratadas",
                        image: "/mixtos.png",
                        price: 25,
                        brand: "Abunga",
                        tipo: "Mix",
                        fruta: "Mix"
                    }} 
                    showActions={true}
                />
             </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#95b721] text-white py-8 mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-['Capriola'] mb-2 text-white">
                abunga
              </h3>
              <p className="text-sm text-white/80">Snacks naturales de Arequipa</p>
            </div>

            <div className="text-center">
              <p className="font-semibold mb-2">Contáctanos</p>
              <a href="tel:973391928" className="text-white hover:text-[#e3c561] transition-colors text-lg">
                📞 973391928
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-white/80">
                © {new Date().getFullYear()} Abunga
              </p>
              <p className="text-xs text-white/60 mt-1">
                Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Catalogo;
