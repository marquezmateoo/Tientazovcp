import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SectorsGrid } from './components/SectorsGrid';
import { ProductGrid } from './components/ProductGrid';
import { CarlosPazStory } from './components/CarlosPazStory';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CuringGuide } from './components/CuringGuide';
import { Testimonials } from './components/Testimonials';
import { CartDrawer } from './components/CartDrawer';
import { AdminDrawer } from './components/AdminDrawer';
import { EditProductModal } from './components/EditProductModal';
import { Footer } from './components/Footer';
import { MessageCircle, Settings, Truck, MapPin } from 'lucide-react';

const StoreContent: React.FC = () => {
  const { config, isAdminMode, setIsSettingsDrawerOpen } = useStore();
  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#1C201D] font-sans selection:bg-[#12231A] selection:text-[#FAF7F2]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Top Header with Official Transparent TIENTAZO Logo */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Presentation Hero Section */}
        <Hero />

        {/* Sectores de la Tienda (Mates, Bombillas, Yerbas, Combos, Canastas, Yerberas, Termos) */}
        <SectorsGrid />

        {/* Product Catalog Grid (Linked directly from Sectors) */}
        <ProductGrid />

        {/* Carlos Paz Story & Workshop */}
        <CarlosPazStory />

        {/* Gauchesca & Modern National Shipping Ribbon */}
        <section className="bg-[#12231A] text-[#FAF7F2] py-12 px-4 border-y border-[#0D1A13]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#C48F56] text-xs font-semibold uppercase tracking-wider mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Nacidos en Villa Carlos Paz · Córdoba</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Embalaje reforzado y envíos seguros a cualquier rincón de la Argentina
              </h2>
              <p className="text-[#A89F90] text-xs sm:text-sm mt-2 leading-relaxed">
                Sabemos lo importante que es tu mate. Despachamos con número de seguimiento y nos aseguramos de que llegue impecable a tu puerta.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola Mateo! Quisiera saber el costo y tiempo de envío de un mate a mi localidad...')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#C48F56] hover:bg-[#B37E47] text-stone-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 hover:scale-[1.02]"
            >
              <Truck className="w-4 h-4 text-stone-950" />
              <span>Consultar Envío a mi Ciudad</span>
            </a>
          </div>
        </section>

        {/* The Curing Ritual: 1 photo at top + 3 detailed guides (Calabaza, Manteca/Madera, Acero) */}
        <CuringGuide />

        {/* Social Proof & Customer Reviews */}
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Floating WhatsApp Button for Customers */}
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola TIENTAZO! Quisiera consultar sobre los modelos de mates disponibles...')}`}
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 border border-emerald-500/40"
          title="Consultar por WhatsApp a Carlos Paz"
          aria-label="Abrir WhatsApp para consultas"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Floating Quick Editor Trigger */}
        <button
          onClick={() => setIsSettingsDrawerOpen(true)}
          className={`w-13 h-13 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 ${
            isAdminMode
              ? 'bg-[#12231A] hover:bg-[#1E392A] text-white ring-4 ring-[#C48F56]/40 border border-[#C48F56]'
              : 'bg-white hover:bg-stone-50 text-[#12231A] border border-[#DDD6C8]'
          }`}
          title="Abrir Panel de Control para editar la tienda"
          aria-label="Panel de edición"
        >
          <Settings className={`w-5 h-5 ${isAdminMode ? 'text-[#C48F56]' : 'text-[#7D7466]'}`} />
        </button>
      </div>

      {/* Drawers and Modals */}
      <CartDrawer />
      <ProductDetailModal />
      <AdminDrawer />
      <EditProductModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
