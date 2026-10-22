import React from 'react';
import { useStore, normalizeWhatsAppNumber } from '../context/StoreContext';
import { MessageCircle, Instagram, MapPin, Truck, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, setIsSettingsDrawerOpen } = useStore();
  const cleanPhone = normalizeWhatsAppNumber(config.whatsappNumber);

  return (
    <footer id="contacto" className="bg-[#12231A] text-[#EDE6D9] pt-16 pb-12 border-t border-[#0D1A13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={config.logoImage}
                alt="Logo TIENTAZO"
                className="w-12 h-12 object-contain select-none"
              />
              <div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wider">
                  {config.brandName}
                </h3>
                <p className="text-[10px] uppercase font-semibold tracking-widest text-[#C48F56]">
                  {config.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A89F90] leading-relaxed">
              Mates criollos forjados en tradición, calabaza natural y costuras con tiento legítimo. Desde las sierras de Villa Carlos Paz para todo el país.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1C3527] hover:bg-emerald-700 text-white flex items-center justify-center transition-colors border border-[#C48F56]/30"
                aria-label="Contactar por WhatsApp"
                title={`WhatsApp: +54 9 3541 61-3365`}
              >
                <MessageCircle className="w-4 h-4 text-[#C48F56]" />
              </a>
              <a
                href={`mailto:${config.contactEmail || 'marquezmateo219@gmail.com'}`}
                className="w-9 h-9 rounded-full bg-[#1C3527] hover:bg-[#966336] text-white flex items-center justify-center transition-colors border border-[#C48F56]/30"
                aria-label="Enviar Email"
                title={`Email: ${config.contactEmail || 'marquezmateo219@gmail.com'}`}
              >
                <Mail className="w-4 h-4 text-[#C48F56]" />
              </a>
              <a
                href={`https://instagram.com/${config.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1C3527] hover:bg-[#966336] text-white flex items-center justify-center transition-colors border border-[#C48F56]/30"
                aria-label="Seguir en Instagram"
              >
                <Instagram className="w-4 h-4 text-[#C48F56]" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C48F56]">
              Colecciones
            </h4>
            <ul className="space-y-2 text-xs text-[#B5AC9E]">
              <li><a href="#catalogo" className="hover:text-white transition-colors">Mates Imperiales Tientazo</a></li>
              <li><a href="#catalogo" className="hover:text-white transition-colors">Mates Camioneros Criollos</a></li>
              <li><a href="#catalogo" className="hover:text-white transition-colors">Mates Torpedos Uruguayos</a></li>
              <li><a href="#catalogo" className="hover:text-white transition-colors">Bombillas Pico de Loro</a></li>
              <li><a href="#catalogo" className="hover:text-white transition-colors">Sets Materos & Bolsos de Cuero</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Ritual */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C48F56]">
              Origen & Envíos
            </h4>
            <ul className="space-y-2 text-xs text-[#B5AC9E]">
              <li><a href="#origen" className="hover:text-white transition-colors">Nuestro taller en Carlos Paz</a></li>
              <li><a href="#curado" className="hover:text-white transition-colors">Guía paso a paso de Curado</a></li>
              <li><a href="#curado" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Atención directa por WhatsApp</a></li>
            </ul>
          </div>

          {/* Col 4: Payments & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C48F56]">
              Atención y Ubicación
            </h4>
            <p className="text-xs text-[#B5AC9E] leading-relaxed">
              Despachamos diariamente con Correo Argentino y Andreani. Bonificación del {config.transferDiscountPercent}% abonando por transferencia o cuotas con Mercado Pago.
            </p>
              <div className="space-y-1.5 pt-1">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C48F56] shrink-0" />
                  <span>{config.location}</span>
                </p>
                <p className="text-[11px] text-[#A89F90] flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp: </span>
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-emerald-400 font-semibold transition-colors underline decoration-dotted"
                  >
                    +54 9 3541 61-3365
                  </a>
                </p>
                <p className="text-[11px] text-[#A89F90] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C48F56] shrink-0" />
                  <span>Email: </span>
                  <a
                    href={`mailto:${config.contactEmail || 'marquezmateo219@gmail.com'}`}
                    className="text-white hover:text-[#C48F56] font-semibold transition-colors underline decoration-dotted"
                  >
                    {config.contactEmail || 'marquezmateo219@gmail.com'}
                  </a>
                </p>
              </div>
          </div>

        </div>

        {/* Bottom copyright and editor quick link */}
        <div className="pt-8 border-t border-[#1F382A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F8778]">
          <p>
            © {new Date().getFullYear()} {config.brandName} · Raíz criolla · Espíritu de hoy. Villa Carlos Paz, Córdoba.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsDrawerOpen(true)}
              className="text-[#C48F56] hover:text-[#E2AE76] transition-colors flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>⚙️ Panel de Edición de la Tienda</span>
            </button>
            <span>·</span>
            <span>Mates artesanales con identidad</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
