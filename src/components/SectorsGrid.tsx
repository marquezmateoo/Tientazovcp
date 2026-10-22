import React from 'react';
import { ProductCategory } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';

interface SectorItem {
  id: ProductCategory;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
}

const SECTORS: SectorItem[] = [
  {
    id: 'Mates',
    title: 'Sector Mates',
    subtitle: 'Imperiales, Camioneros y Torpedos',
    image: '/src/assets/images/mate_imperial_cuero_1792497938491.jpg',
    badge: 'Calabazas & Cuero',
  },
  {
    id: 'Bombillas',
    title: 'Sector Bombillas',
    subtitle: 'Pico de Loro y Alpaca Cincelada',
    image: '/src/assets/images/bombilla_alpaca_artesanal_1792497962346.jpg',
    badge: 'Alpaca Maciza',
  },
  {
    id: 'Yerbas',
    title: 'Sector Yerbas',
    subtitle: 'Estacionamiento Natural y Molienda Especial',
    image: '/src/assets/images/yerbera_cuero_artesanal_1792503121632.jpg',
    badge: 'Barbacuá & Criollas',
  },
  {
    id: 'Combos',
    title: 'Sector Combos',
    subtitle: 'Kits Materos Completos con Termo',
    image: '/src/assets/images/hero_artisan_mate_set_1792497937752.jpg',
    badge: 'Equipos Listos',
  },
  {
    id: 'Canastas y Materas',
    title: 'Sector Canastas',
    subtitle: 'Bolsos y Materas Rígidas de Cuero Vaqueta',
    image: '/src/assets/images/termo_matera_set_1792497962440.jpg',
    badge: 'Cuero Vaqueta',
  },
  {
    id: 'Yerberas',
    title: 'Sector Yerberas',
    subtitle: 'Con Pico Vertedor y Cierre Hermético',
    image: '/src/assets/images/yerbera_cuero_artesanal_1792503121632.jpg',
    badge: 'Cuero & Herméticas',
  },
  {
    id: 'Termos',
    title: 'Sector Termos',
    subtitle: 'Acero Inoxidable 1L con Pico Cebador',
    image: '/src/assets/images/termo_acero_negro_1792503121098.jpg',
    badge: 'Térmicos 24hs',
  },
];

interface SectorsGridProps {
  onSelectCategory?: (category: ProductCategory) => void;
}

export const SectorsGrid: React.FC<SectorsGridProps> = ({ onSelectCategory }) => {
  const { setActiveCategory } = useStore();

  const handleClickSector = (category: ProductCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    setActiveCategory(category);

    const element = document.getElementById('catalogo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="sectores" className="py-14 bg-white border-b border-[#E3DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-[#966336] uppercase block mb-1.5">
            Sectores de la Tienda
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12231A] tracking-tight">
            Elegí tu Sector
          </h2>
          <p className="text-xs sm:text-sm text-[#706757] mt-1.5 leading-relaxed">
            Tocá el sector que buscás y te llevamos directo a la selección de productos disponibles.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {SECTORS.map((sector) => (
            <button
              key={sector.id}
              onClick={() => handleClickSector(sector.id)}
              className="group relative flex flex-col text-left bg-[#FAF8F3] rounded-2xl overflow-hidden border border-[#E3DBD0] transition-all duration-200 hover:shadow-xl hover:-translate-y-1 hover:border-[#12231A]/50 focus:outline-hidden"
            >
              {/* Sector Thumbnail Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE6DA]">
                <img
                  src={sector.image}
                  alt={sector.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Arrow indicator */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 text-[#12231A] flex items-center justify-center shadow-md transition-all group-hover:scale-110 group-hover:bg-[#12231A] group-hover:text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Subtitle tag on photo */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-bold text-[#E8DFD0] uppercase tracking-wider block bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs w-fit">
                    {sector.badge}
                  </span>
                </div>
              </div>

              {/* Sector Info */}
              <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <h3 className="text-base font-bold text-[#12231A] group-hover:text-[#966336] transition-colors leading-snug">
                    {sector.title}
                  </h3>
                  <p className="text-xs text-[#706757] line-clamp-1 mt-0.5">
                    {sector.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#F0EAE0] flex items-center justify-between text-xs font-bold text-[#12231A] group-hover:text-[#966336] transition-colors">
                  <span>Ir a la venta</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
