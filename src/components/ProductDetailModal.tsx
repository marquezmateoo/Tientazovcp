import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Check, Truck, ShieldCheck, MapPin } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForDetail, setSelectedProductForDetail, addToCart, config } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detalles' | 'curado' | 'especificaciones'>('detalles');

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#FAF8F3] rounded-3xl shadow-2xl border border-[#D5C9B5] overflow-hidden flex flex-col md:flex-row my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: High Res Image with zoom & badge */}
        <div className="md:w-1/2 relative bg-[#F0EAE0] flex items-center justify-center min-h-[340px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover max-h-[500px]"
            referrerPolicy="no-referrer"
          />
          {product.tag && (
            <div className="absolute top-4 left-4 z-10 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 bg-[#12231A]/90 text-[#F5EDE1] rounded-lg backdrop-blur-sm border border-[#C48F56]/40">
              {product.tag}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            
            {/* Category and location kicker */}
            <div className="flex items-center gap-1.5 text-xs uppercase font-semibold tracking-wider text-[#966336] mb-1.5">
              <span>{product.category}</span>
              <span aria-hidden="true" className="text-[#C48F56]/60">·</span>
              <MapPin className="w-3 h-3 text-[#C48F56]" />
              <span>{product.specs?.origen || 'Villa Carlos Paz'}</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12231A] leading-snug mb-3">
              {product.name}
            </h2>

            {/* Price with transfer promo */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#12231A] tabular-nums">
                {config.currency}{product.price.toLocaleString('es-AR')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  {config.currency}{product.originalPrice.toLocaleString('es-AR')}
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {config.transferDiscountPercent}% OFF Transferencia
              </span>
            </div>

            {/* Tabs for Information */}
            <div className="flex border-b border-[#E3DBD0] mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('detalles')}
                className={`pb-2 mr-4 transition-colors ${
                  activeTab === 'detalles'
                    ? 'border-b-2 border-[#12231A] text-[#12231A]'
                    : 'text-[#7D7466] hover:text-[#12231A]'
                }`}
              >
                Descripción
              </button>
              <button
                onClick={() => setActiveTab('especificaciones')}
                className={`pb-2 mr-4 transition-colors ${
                  activeTab === 'especificaciones'
                    ? 'border-b-2 border-[#12231A] text-[#12231A]'
                    : 'text-[#7D7466] hover:text-[#12231A]'
                }`}
              >
                Ficha Técnica
              </button>
              <button
                onClick={() => setActiveTab('curado')}
                className={`pb-2 transition-colors ${
                  activeTab === 'curado'
                    ? 'border-b-2 border-[#12231A] text-[#12231A]'
                    : 'text-[#7D7466] hover:text-[#12231A]'
                }`}
              >
                Curado y Consejos
              </button>
            </div>

            {/* Tab 1: Detalles */}
            {activeTab === 'detalles' && (
              <div className="space-y-3 mb-6">
                <p className="text-xs text-[#4F473A] leading-relaxed">
                  {product.description}
                </p>
                <div className="space-y-1.5 pt-1">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#2E2922]">
                      <Check className="w-3.5 h-3.5 text-[#C48F56] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Ficha Técnica */}
            {activeTab === 'especificaciones' && (
              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#ECE7DD]">
                  <span className="text-[#756C5E]">Cuerpo & Cuero:</span>
                  <span className="font-semibold text-[#12231A]">{product.specs.material}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#ECE7DD]">
                  <span className="text-[#756C5E]">Virola:</span>
                  <span className="font-semibold text-[#12231A]">{product.specs.virola}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#ECE7DD]">
                  <span className="text-[#756C5E]">Capacidad aproximada:</span>
                  <span className="font-semibold text-[#12231A]">{product.specs.capacidad}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#ECE7DD]">
                  <span className="text-[#756C5E]">Origen del taller:</span>
                  <span className="font-semibold text-[#12231A]">{product.specs.origen}</span>
                </div>
              </div>
            )}

            {/* Tab 3: Curado */}
            {activeTab === 'curado' && (
              <div className="space-y-2 mb-6 text-xs text-[#4F473A] leading-relaxed">
                <p>
                  <strong>1. Llenado inicial:</strong> Llená la calabaza con yerba mate húmeda (puede ser usada).
                </p>
                <p>
                  <strong>2. Reposo de 24 hs:</strong> Agregale un chorrito de agua tibia (70°C) y dejalo reposar durante un día.
                </p>
                <p>
                  <strong>3. Raspado interior:</strong> Con una cuchara sopera, raspá suavemente las paredes para retirar los hollejos sueltos.
                </p>
                <p>
                  <strong>4. ¡Listo para cebar!</strong> Tu mate Tientazo queda perfectamente sellado para acompañar tus mañanas y tardes.
                </p>
              </div>
            )}

            {/* New Store Trust Note */}
            <div className="mb-6 p-3 bg-[#EFE9DE] border border-[#DDD5C5] rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-[#12231A] text-[#C48F56] rounded-xl shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-[#4F473A] leading-tight">
                <strong>Envíos a todo el país desde Villa Carlos Paz.</strong> Embalamos cada pieza de forma ultra protegida para que llegue intacta a tus manos.
              </p>
            </div>

          </div>

          {/* Action Module Baseline */}
          <div className="pt-4 border-t border-[#E3DBD0]">
            <div className="flex items-center gap-3">
              
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#D5C9B5] rounded-xl bg-white overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-[#F3EFE7] text-sm font-bold"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-stone-800 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-[#F3EFE7] text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#C48F56]" />
                <span>Agregar a la Bolsa · {config.currency}{(product.price * quantity).toLocaleString('es-AR')}</span>
              </button>

            </div>

            {/* Quick trust reassurance */}
            <div className="flex items-center justify-between text-[11px] text-[#706757] mt-3 pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C48F56]" />
                Envíos Correo / Andreani
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C48F56]" />
                Garantía artesanal TIENTAZO
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
