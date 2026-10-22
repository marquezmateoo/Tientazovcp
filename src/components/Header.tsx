import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Settings, Menu, X, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { config, cartCount, setIsCartOpen, isAdminMode, setIsAdminMode, setIsSettingsDrawerOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#E3DBD0]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Mark Lockup */}
          <a
            href="#"
            className="flex items-center gap-3.5 group whitespace-nowrap shrink-0"
          >
            <img
              src="/assets/tientazo/tientazo_t_official.png"
              alt="Logo TIENTAZO"
              className="h-11 w-auto object-contain select-none transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#12231A] group-hover:text-[#2A523A] transition-colors leading-none">
                {config.brandName}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#966336] mt-1">
                {config.tagline}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (4-5 single-line clean text links, no grabados) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#464036]">
            <a
              href="#catalogo"
              className="hover:text-[#12231A] transition-colors whitespace-nowrap shrink-0"
            >
              Colección de Mates
            </a>
            <a
              href="#origen"
              className="hover:text-[#12231A] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C48F56]" />
              <span>Carlos Paz & Envíos</span>
            </a>
            <a
              href="#curado"
              className="hover:text-[#12231A] transition-colors whitespace-nowrap shrink-0"
            >
              Ritual del Curado
            </a>
            <a
              href="#opiniones"
              className="hover:text-[#12231A] transition-colors whitespace-nowrap shrink-0"
            >
              Opiniones
            </a>
            <a
              href="#contacto"
              className="hover:text-[#12231A] transition-colors whitespace-nowrap shrink-0"
            >
              Contacto
            </a>
          </nav>

          {/* Zone 3: Actions (Cart & Admin Mode Toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Mode Switch */}
            <button
              onClick={() => {
                if (!isAdminMode) {
                  setIsAdminMode(true);
                  setIsSettingsDrawerOpen(true);
                } else {
                  setIsSettingsDrawerOpen(true);
                }
              }}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-colors border whitespace-nowrap shrink-0 ${
                isAdminMode
                  ? 'bg-[#12231A] text-[#FAF7F2] border-[#12231A] hover:bg-[#1C3527]'
                  : 'bg-white text-[#464036] border-[#DED7CB] hover:bg-[#F3EFE7]'
              }`}
              title="Panel para cambiar fotos, precios, textos y configurar WhatsApp"
            >
              <Settings className={`w-3.5 h-3.5 ${isAdminMode ? 'text-[#C48F56] animate-spin-slow' : 'text-[#7D7466]'}`} />
              <span className="hidden sm:inline">
                {isAdminMode ? 'Editor Activo' : 'Editar Tienda'}
              </span>
            </button>

            {/* Primary Action: Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Ver carrito (${cartCount} productos)`}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#D7A269]" />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="bg-[#C48F56] text-stone-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2D2A24] hover:text-[#12231A]"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3DBD0] bg-[#F8F6F0] px-4 py-4 space-y-3">
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1C201D] hover:text-[#12231A] py-1"
          >
            Colección de Mates
          </a>
          <a
            href="#origen"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1C201D] hover:text-[#12231A] py-1"
          >
            📍 Carlos Paz & Envíos Nacionales
          </a>
          <a
            href="#curado"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1C201D] hover:text-[#12231A] py-1"
          >
            Cómo Curar tu Mate
          </a>
          <a
            href="#opiniones"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1C201D] hover:text-[#12231A] py-1"
          >
            Opiniones de Clientes
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1C201D] hover:text-[#12231A] py-1"
          >
            Contacto & WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};
