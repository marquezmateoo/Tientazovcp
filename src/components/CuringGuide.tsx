import React, { useState } from 'react';
import { Sparkles, Check, ChevronDown, ChevronUp, Droplets, Flame, ShieldCheck } from 'lucide-react';

export const CuringGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calabaza' | 'madera' | 'acero'>('calabaza');

  return (
    <section id="curado" className="py-16 bg-[#FAF7F2] border-b border-[#E3DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-[#966336] uppercase block mb-1">
            Guía Oficial del Taller
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12231A] tracking-tight mb-3">
            Cómo Curar y Cuidar tu Mate
          </h2>
          <p className="text-xs sm:text-sm text-[#5F574A] max-w-xl mx-auto leading-relaxed">
            Cada material tiene su naturaleza. Te explicamos de forma sencilla y directa cómo preparar tu mate según sea de calabaza, madera o acero inoxidable.
          </p>
        </div>

        {/* Hero Card: Single Clean Photo at the Top */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#D5C9B5] aspect-[16/9] sm:aspect-[21/9] bg-[#EAE2D5]">
            <img
              src="/src/assets/images/hero_artisan_mate_set_1792497937752.jpg"
              alt="Ritual del curado del mate criollo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12231A]/90 via-[#12231A]/30 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C48F56] block mb-1">
                  El bautismo de tu compañero
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                  Un buen curado sella el poro, elimina asperezas y garantiza cebadas limpias
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Nav Tabs: Calabaza, Madera (Manteca), Acero */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex bg-[#EFE9DE] p-1.5 rounded-2xl border border-[#D8CEBE]">
            <button
              onClick={() => setActiveTab('calabaza')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === 'calabaza'
                  ? 'bg-[#12231A] text-white shadow-sm'
                  : 'text-[#5F574A] hover:text-[#12231A]'
              }`}
            >
              1. Mate de Calabaza
            </button>
            <button
              onClick={() => setActiveTab('madera')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === 'madera'
                  ? 'bg-[#12231A] text-white shadow-sm'
                  : 'text-[#5F574A] hover:text-[#12231A]'
              }`}
            >
              2. Madera (Manteca / Grasa)
            </button>
            <button
              onClick={() => setActiveTab('acero')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                activeTab === 'acero'
                  ? 'bg-[#12231A] text-white shadow-sm'
                  : 'text-[#5F574A] hover:text-[#12231A]'
              }`}
            >
              3. Mates de Acero
            </button>
          </div>
        </div>

        {/* Content Section by Tab */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E3DBD0] shadow-xs">
          
          {/* TAB 1: CURADO DE CALABAZA */}
          {activeTab === 'calabaza' && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE0] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#966336]">
                  Tradición Rioplatense
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#12231A] mt-1">
                  Curado Tradicional para Mates de Calabaza
                </h3>
                <p className="text-xs sm:text-sm text-[#5F574A] mt-1">
                  Aplica para mates Imperiales, Camioneros y Torpedos forrados en cuero.
                </p>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-[#464036] leading-relaxed">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Llenado con yerba húmeda tibia</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Llená la calabaza virgen hasta tres cuartos con yerba usada tibia (de una cebada del día, sin fermentar) o yerba nueva previamente humedecida.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Agua tibia y reposo de 24 horas</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Agregá un chorrito de agua tibia a 70°C (nunca hirviendo para evitar que la calabaza se agriete). Dejalo reposar durante 24 horas. La calabaza absorberá el líquido hinchándose levemente.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Raspado de hollejos con cuchara</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Vaciá la yerba y, con el lomo de una cuchara de metal, raspá suavemente las paredes interiores de abajo hacia arriba. Vas a notar cómo se desprenden los hollejos y pulpa leñosa que causan amargor.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    4
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Repetir y listo para cebar</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Repetí el procedimiento 1 o 2 veces más. Cuando la pared interior tome un color verde oliva oscuro homogéneo, el mate está sellado y listo para cebar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-[#E3DBD0] rounded-2xl text-xs text-[#706757] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#966336] shrink-0" />
                <span>
                  <strong>Importante:</strong> Secar siempre con un paño limpio y dejar reposar parado en lugar aireado. Nunca dejes el cuero sumergido en agua.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: CURADO CON MANTECA O GRASA PARA MADERA */}
          {activeTab === 'madera' && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE0] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#966336]">
                  Maderas Nobles (Algarrobo / Caldén / Palo Santo)
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#12231A] mt-1">
                  Curado con Manteca o Grasa Neutra
                </h3>
                <p className="text-xs sm:text-sm text-[#5F574A] mt-1">
                  La madera necesita hidratarse con una materia grasa para sellar las vetas e impedir rajaduras por los cambios bruscos de temperatura.
                </p>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-[#464036] leading-relaxed">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Untado interior con manteca</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Untá con los dedos o una servilleta todo el interior del mate de madera con <strong>manteca sin sal</strong>, grasa vacuna neutra o aceite de cocina. Asegurate de cubrir bien el fondo y las paredes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Reposo de 24 a 48 horas</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Dejá que la madera absorba la grasa durante al menos 24 horas. Verás que la superficie va tomando un tono más oscuro y nutrido.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Lavado con agua tibia</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Retirá el exceso de grasa lavando el interior con agua tibia (sin detergentes abrasivos) y secalo bien.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    4
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Cebada de prueba</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Colocale yerba mate humedecida durante un día más para que adquiera el aroma característico y ¡listo para disfrutar!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-[#E3DBD0] rounded-2xl text-xs text-[#706757] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#966336] shrink-0" />
                <span>
                  <strong>Tip de criollo:</strong> Nunca dejes un mate de madera expuesto al rayo del sol directo ni al calor de una estufa para evitar que se abra.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: LIMPIEZA DE MATES DE ACERO */}
          {activeTab === 'acero' && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE0] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#966336]">
                  Acero Inoxidable Quirúrgico 304 / Térmicos
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#12231A] mt-1">
                  Cómo Limpiar y Mantener los Mates de Acero
                </h3>
                <p className="text-xs sm:text-sm text-[#5F574A] mt-1">
                  Los mates de acero no requieren ningún curado previo porque no son porosos. Su mantenimiento es higiénico, práctico e instantáneo.
                </p>
              </div>

              <div className="space-y-5 text-xs sm:text-sm text-[#464036] leading-relaxed">
                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Lavado inicial antes del primer uso</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Solo requiere lavarlo con agua tibia y detergente neutro para retirar cualquier residuo de fábrica o pulido. Ya podés cebar inmediatamente.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Limpieza diaria post cebada</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Al terminar de tomar, vaciá la yerba y enjuagalo con agua corriente. Podés usar una esponja suave (no virulana para no rayar el acero ni la pintura exterior).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#12231A] text-[#C48F56] font-bold flex items-center justify-center shrink-0 text-sm">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-[#12231A]">Quitar manchas de sarro o pigmentos</h4>
                    <p className="text-[#5F574A] mt-0.5">
                      Si con los meses el acero adquiere una coloración verdosa por los taninos de la yerba, colocale una cucharadita de <strong>bicarbonato de sodio</strong> y un chorrito de agua caliente. Dejá actuar 15 minutos, enjuagá y quedará brillante como nuevo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F3] border border-[#E3DBD0] rounded-2xl text-xs text-[#706757] flex items-center gap-2.5">
                <Check className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  <strong>Gran ventaja:</strong> El acero no transmite hongos, no absorbe olores y te permite cambiar de marca de yerba o intercalar con mate dulce sin alterar el sabor.
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
