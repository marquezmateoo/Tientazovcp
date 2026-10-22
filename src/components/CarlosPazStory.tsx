import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Truck, HeartHandshake, ShieldCheck } from 'lucide-react';

export const CarlosPazStory: React.FC = () => {
  const { config } = useStore();

  return (
    <section id="origen" className="py-16 bg-[#F2EDE3] border-b border-[#E3DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DDD5C5] shadow-xs relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#966336] uppercase mb-3">
                <MapPin className="w-4 h-4 text-[#C48F56]" />
                <span>Nuestra Raíz en Villa Carlos Paz, Córdoba</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12231A] tracking-tight mb-4">
                Un proyecto que nace entre sierras, cueros y mates compartidos
              </h2>

              <p className="text-sm sm:text-base text-[#4E473D] leading-relaxed mb-4">
                <strong>TIENTAZO</strong> nace en el corazón de Villa Carlos Paz con una misión simple y profunda: reivindicar la nobleza de la artesanía gaucha con un diseño limpio, moderno y perdurable. 
              </p>

              <p className="text-xs sm:text-sm text-[#635B4E] leading-relaxed mb-8">
                Recién estamos abriendo nuestras puertas y dando los primeros pasos. Por eso, cada mate que sale de nuestro taller es revisado y embalado con una atención única y personalizada. Hacemos envíos diarios a todo el país para que disfrutes de un mate digno de las mejores cebadas.
              </p>

              {/* 3 Pillars of Tientazo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#EFE9DE]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#12231A] text-[#C48F56] shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12231A] uppercase tracking-wide">Envíos a Todo el País</h4>
                    <p className="text-[11px] text-[#706757] mt-0.5 leading-snug">
                      Despachamos desde Córdoba hacia cualquier rincón de la Argentina.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#12231A] text-[#C48F56] shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12231A] uppercase tracking-wide">Trato Mano a Mano</h4>
                    <p className="text-[11px] text-[#706757] mt-0.5 leading-snug">
                      Hablás directo con nosotros por WhatsApp para sacarte cualquier duda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#12231A] text-[#C48F56] shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#12231A] uppercase tracking-wide">Cuero & Tiento Real</h4>
                    <p className="text-[11px] text-[#706757] mt-0.5 leading-snug">
                      Costuras firmes y calabazas de poro grueso que no filtran ni se rajan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Badge Decal Showcase (Crisp Transparent PNG) */}
            <div className="lg:col-span-4 flex justify-center items-center">
              <div className="p-6 bg-[#FAF7F2] rounded-3xl border border-[#D5C9B5] shadow-inner text-center max-w-xs">
                <img
                  src={config.logoBadgeImage}
                  alt="Sello Oficial TIENTAZO"
                  className="w-48 h-auto object-contain mx-auto drop-shadow-md select-none"
                />
                <div className="mt-4 pt-3 border-t border-[#E3DBD0]">
                  <p className="text-xs font-bold text-[#12231A] uppercase tracking-wider">
                    Sello de Origen Criollo
                  </p>
                  <p className="text-[11px] text-[#966336] mt-0.5 font-medium">
                    Villa Carlos Paz · Córdoba
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
