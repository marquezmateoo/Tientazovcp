import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, MessageCircle, MapPin, ShieldCheck, Truck, Award, Edit3 } from 'lucide-react';
import heroRealPhoto from '../assets/images/regenerated_image_1792504776987.jpg';

export const Hero: React.FC = () => {
  const { config, updateConfig, isAdminMode } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(config.heroTitle);
  const [subtitle, setSubtitle] = useState(config.heroSubtitle);
  const [badge, setBadge] = useState(config.heroBadge);

  const heroImgSrc =
    config.heroImage &&
    !config.heroImage.includes('carpincho') &&
    !config.heroImage.includes('hero_artisan')
      ? (config.heroImage.includes('regenerated_image') ? heroRealPhoto : config.heroImage)
      : heroRealPhoto;

  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSave = () => {
    updateConfig({
      heroTitle: title,
      heroSubtitle: subtitle,
      heroBadge: badge,
    });
    setIsEditing(false);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-[#E3DBD0]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Quick Editor Box for Hero */}
        {isAdminMode && (
          <div className="mb-6 p-4 rounded-xl border border-[#C48F56]/60 bg-[#F5EDE1] text-xs flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-[#12231A] flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-[#966336]" />
              Modo Edición: Podés cambiar el título, subtítulo o imagen de la portada.
            </span>
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="px-3.5 py-1.5 bg-[#12231A] hover:bg-[#1E392A] text-white rounded-lg font-medium transition-colors"
            >
              {isEditing ? 'Guardar Cambios' : 'Editar Portada'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Brand Lockup & Editorial Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Clean Brand Lockup with Official Transparent Badge */}
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src="/assets/tientazo/tientazo_badge_official.png"
                alt="Logo Oficial TIENTAZO"
                className="h-14 w-auto object-contain drop-shadow-xs select-none"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#966336] uppercase">
                  <MapPin className="w-3.5 h-3.5 text-[#C48F56] shrink-0" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="bg-white border border-[#D5C9B5] px-2 py-0.5 rounded text-xs text-stone-800 w-64"
                    />
                  ) : (
                    <span>{config.heroBadge}</span>
                  )}
                </div>
                <span className="text-[11px] text-[#706757] font-medium">
                  {config.tagline}
                </span>
              </div>
            </div>

            {/* Headline */}
            {isEditing ? (
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={2}
                className="w-full font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12231A] bg-white border border-[#D5C9B5] p-2 rounded-xl mb-4"
              />
            ) : (
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#12231A] tracking-tight leading-[1.12] mb-6 [text-wrap:balance]">
                {config.heroTitle}
              </h1>
            )}

            {/* Subtitle */}
            {isEditing ? (
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={3}
                className="w-full text-[#4E473D] bg-white border border-[#D5C9B5] p-2 rounded-xl text-base mb-6"
              />
            ) : (
              <p className="text-base sm:text-lg text-[#4E473D] leading-relaxed max-w-xl mb-8">
                {config.heroSubtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#12231A] hover:bg-[#1E392A] text-white font-semibold rounded-xl text-sm transition-all shadow-sm hover:translate-y-[-1px]"
              >
                <span>Ver Colección de Mates</span>
                <ArrowRight className="w-4 h-4 text-[#D7A269]" />
              </a>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola TIENTAZO! Quisiera consultar por los modelos de mates disponibles para envío...')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#EFE9DD] hover:bg-[#E5DDCF] text-[#12231A] font-semibold rounded-xl text-sm border border-[#D8CEBE] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Asesoramiento por WhatsApp</span>
              </a>
            </div>

            {/* Origin & Craftsmanship Proof Indicators */}
            <div className="pt-6 border-t border-[#E3DBD0] grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#12231A]">Carlos Paz</p>
                <p className="text-xs text-[#706757] mt-0.5">Taller en las sierras</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#12231A]">Nacional</p>
                <p className="text-xs text-[#706757] mt-0.5">Envíos a todo el país</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl font-bold text-[#12231A]">Tiento Real</p>
                <p className="text-xs text-[#706757] mt-0.5">Cuero vacuno genuino</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] rounded-3xl overflow-hidden shadow-xl border border-[#D8CEBE] bg-[#EFEADE]">
              <img
                src={heroImgSrc}
                alt="Mate artesanal criollo TIENTAZO al atardecer en las sierras"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>

        {/* Value Prop Banner strip below hero */}
        <div className="mt-12 pt-8 border-t border-[#E3DBD0] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-[#E3DBD0]/80">
            <div className="p-2.5 rounded-xl bg-[#12231A] text-[#C48F56] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12231A]">De Carlos Paz a tu Casa</h3>
              <p className="text-xs text-[#5F574A] mt-0.5 leading-relaxed">
                Despachos seguros a todo el país vía Correo Argentino y Andreani. Embalaje protegido antigolpes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-[#E3DBD0]/80">
            <div className="p-2.5 rounded-xl bg-[#12231A] text-[#C48F56] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12231A]">Calabazas Seleccionadas</h3>
              <p className="text-xs text-[#5F574A] mt-0.5 leading-relaxed">
                Cada mate es revisado a mano: paredes gruesas, porosidad ideal y base firme que no se tambalea.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-[#E3DBD0]/80">
            <div className="p-2.5 rounded-xl bg-[#12231A] text-[#C48F56] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12231A]">Atención Artesanal Directa</h3>
              <p className="text-xs text-[#5F574A] mt-0.5 leading-relaxed">
                Estamos arrancando y cuidamos cada detalle. Te acompañamos en el curado para que tu mate dure años.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
