import React, { useState } from 'react';
import { useStore, normalizeWhatsAppNumber } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle, ShieldCheck, CheckCircle, MapPin } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    config,
    createOrder,
  } = useStore();
  
  // Checkout Form State
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card' | 'cash'>('transfer');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string>('');
  const [lastWaUrl, setLastWaUrl] = useState<string>('');

  if (!isCartOpen) return null;

  // Free shipping math
  const freeShippingThreshold = config.freeShippingThreshold || 45000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Discount math
  const couponDiscount = discountApplied ? cartSubtotal * 0.1 : 0;
  const transferDiscount = paymentMethod === 'transfer' ? (cartSubtotal - couponDiscount) * (config.transferDiscountPercent / 100) : 0;
  const totalAmount = Math.max(0, cartSubtotal - couponDiscount - transferDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TIENTAZO' || promoCode.trim().toUpperCase() === 'CARLOSPAZ' || promoCode.trim().toUpperCase() === 'PAMPA10') {
      setDiscountApplied(true);
    } else {
      alert('Cupón no válido. Probá con TIENTAZO o CARLOSPAZ');
    }
  };

  // WhatsApp Order Link Generator
  const handleSendOrderWhatsApp = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor completá tu nombre y teléfono para procesar el pedido.');
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      category: item.product.category,
    }));

    const paymentLabel =
      paymentMethod === 'transfer'
        ? `Transferencia Bancaria (${config.transferDiscountPercent}% OFF)`
        : paymentMethod === 'card'
        ? 'Tarjeta / Mercado Pago (3 y 6 Cuotas)'
        : 'Efectivo / Retiro en Carlos Paz';

    const recordedOrder = createOrder({
      customerName,
      customerPhone,
      customerAddress,
      customerCity,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: couponDiscount + transferDiscount,
      shippingCost: 0,
      total: totalAmount,
      paymentMethod,
      status: 'pending',
      shippingCarrier: isFreeShipping ? 'Envío Nacional Gratis (Andreani/Correo)' : 'A coordinar',
    });

    setPlacedOrderNumber(recordedOrder.orderNumber);

    const itemsSummary = cart
      .map((item, idx) => {
        return `${idx + 1}. *${item.product.name}* x${item.quantity} - ${config.currency}${(item.product.price * item.quantity).toLocaleString('es-AR')}`;
      })
      .join('\n');

    const orderText = `*NUEVO PEDIDO EN TIENTAZO* 🧉✨
*N° de Pedido:* ${recordedOrder.orderNumber}
_Raíz criolla · Espíritu de hoy (Villa Carlos Paz)_

*Cliente:* ${customerName}
*Teléfono:* ${customerPhone}
*Dirección de Entrega:* ${customerAddress ? customerAddress + ', ' : ''}${customerCity}
*Forma de Pago:* ${paymentLabel}
${isFreeShipping ? '🚚 *Envío Nacional:* ¡GRATIS a domicilio!' : '🚚 *Envío:* A coordinar por Correo Argentino / Andreani'}

*Detalle de Productos:*
${itemsSummary}

---------------------------
*Subtotal:* ${config.currency}${cartSubtotal.toLocaleString('es-AR')}
${transferDiscount > 0 ? `*Descuento Transferencia (${config.transferDiscountPercent}%):* -${config.currency}${transferDiscount.toLocaleString('es-AR')}\n` : ''}${discountApplied ? `*Cupón 10% OFF:* -${config.currency}${couponDiscount.toLocaleString('es-AR')}\n` : ''}*TOTAL FINAL:* ${config.currency}${totalAmount.toLocaleString('es-AR')}

_¡Hola Mateo! Te paso mi pedido #${recordedOrder.orderNumber} desde la tienda online para coordinar el pago y despacho. ¡Muchas gracias!_`;

    const cleanPhone = normalizeWhatsAppNumber(config.whatsappNumber);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderText)}`;
    setLastWaUrl(waUrl);
    
    // Open WhatsApp
    window.open(waUrl, '_blank');
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-[#FAF8F3] shadow-2xl flex flex-col h-full border-l border-[#D5C9B5]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E3DBD0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#12231A]" />
            <h2 className="font-serif text-lg font-bold text-[#12231A]">
              {step === 'cart' ? `Bolsa de Compras (${cartCount})` : step === 'checkout' ? 'Datos para el Despacho' : '¡Pedido Enviado!'}
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        {step !== 'success' && (
          <div className="bg-[#EFE9DE] px-4 py-2.5 border-b border-[#DDD5C5]">
            <div className="flex justify-between items-center text-xs font-medium text-[#12231A] mb-1.5">
              <span>
                {isFreeShipping ? (
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> ¡Envío gratis a todo el país bonificado!
                  </span>
                ) : (
                  <span>
                    Faltan <strong>{config.currency}{amountNeededForFreeShipping.toLocaleString('es-AR')}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="tabular-nums text-[11px] text-[#966336] font-bold">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-[#DCD3C3] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#12231A] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body content based on step */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          
          {/* STEP 1: CART ITEMS */}
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#706757]">
                  <div className="w-16 h-16 rounded-full bg-[#EFE9DE] flex items-center justify-center mb-4 text-[#966336]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-serif text-lg font-bold text-[#12231A] mb-1">
                    Tu bolsa está vacía
                  </p>
                  <p className="text-xs text-[#5F574A] max-w-xs mb-6">
                    Descubrí nuestros mates imperiales, camioneros y bombillas artesanales nacidas en Carlos Paz.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-5 py-2.5 bg-[#12231A] text-white text-xs font-semibold rounded-xl hover:bg-[#1E392A] transition-colors"
                  >
                    Ver Catálogo TIENTAZO
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 bg-white p-3 rounded-2xl border border-[#E3DBD0] shadow-xs"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#F0EAE0] shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#12231A] truncate">
                          {item.product.name}
                        </h4>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-[#D5C9B5] rounded-lg bg-[#FAF8F3]">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-900"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-xs font-bold text-[#12231A] tabular-nums">
                            {config.currency}{(item.product.price * item.quantity).toLocaleString('es-AR')}
                          </span>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(index)}
                            className="p-1 text-stone-400 hover:text-red-700 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo coupon input */}
                  <form onSubmit={handleApplyCoupon} className="pt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupón (ej: TIENTAZO)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 text-xs bg-white border border-[#D5C9B5] rounded-xl px-3 py-2 text-stone-800 uppercase focus:outline-none focus:border-[#12231A]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-xs font-semibold rounded-xl transition-colors shrink-0"
                    >
                      Aplicar
                    </button>
                  </form>
                  {discountApplied && (
                    <p className="text-xs text-emerald-800 font-semibold">
                      ✓ Cupón de 10% OFF aplicado con éxito
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <div className="space-y-4">
              <div className="bg-[#EFE9DE] p-3 rounded-2xl text-xs text-[#4F473A] border border-[#DDD5C5]">
                <p className="font-semibold text-[#12231A] mb-0.5">Envíos desde Villa Carlos Paz a todo el país.</p>
                Completá tus datos para que te preparemos el paquete y coordinemos el despacho directo por WhatsApp.
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcos Silva"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">WhatsApp / Teléfono de Contacto *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 351 123-4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Dirección de Entrega</label>
                <input
                  type="text"
                  placeholder="Calle, número, piso/depto"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Ciudad y Provincia *</label>
                <input
                  type="text"
                  placeholder="Ej: Carlos Paz / Córdoba Capital / CABA / Rosario"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#12231A] mb-2">Forma de Pago</label>
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('transfer')}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs transition-colors ${
                      paymentMethod === 'transfer'
                        ? 'border-[#12231A] bg-[#EFE9DE] font-semibold text-[#12231A]'
                        : 'border-[#E3DBD0] bg-white text-[#5F574A]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#12231A]">Transferencia Bancaria</span>
                      <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                        ¡Ahorrás {config.transferDiscountPercent}% ({config.currency}{transferDiscount.toLocaleString('es-AR')})!
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                      15% OFF
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#12231A] bg-[#EFE9DE] font-semibold text-[#12231A]'
                        : 'border-[#E3DBD0] bg-white text-[#5F574A]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#12231A]">Mercado Pago / Tarjetas</span>
                      <p className="text-[11px] text-[#706757] mt-0.5">Hasta 3 y 6 cuotas</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer text-xs transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-[#12231A] bg-[#EFE9DE] font-semibold text-[#12231A]'
                        : 'border-[#E3DBD0] bg-white text-[#5F574A]'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#12231A]">Efectivo / Retiro en Carlos Paz</span>
                      <p className="text-[11px] text-[#706757] mt-0.5">A coordinar en punto de entrega</p>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'transfer' && (
                <div className="p-3 bg-white border border-[#D5C9B5] rounded-2xl text-[11px] text-[#5F574A] space-y-1">
                  <p><strong>Alias para transferir:</strong> <span className="font-mono bg-[#EFE9DE] px-2 py-0.5 rounded font-bold text-[#12231A]">{config.aliasCbu}</span></p>
                  <p><strong>Entidad:</strong> {config.bankName}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#12231A] mb-2">
                ¡Pedido Enviado a TIENTAZO!
              </h3>
              <p className="text-xs text-[#5F574A] max-w-xs mb-4 leading-relaxed">
                Se abrió la conversación en WhatsApp con el detalle completo de tus productos y datos para que en Carlos Paz comiencen a prepararlo.
              </p>
              <div className="bg-white border border-[#D5C9B5] p-3 rounded-2xl text-xs font-mono text-[#12231A] font-bold mb-4 w-full text-center">
                Orden #{placedOrderNumber || 'TNZ-1004'}
              </div>
              {lastWaUrl && (
                <a
                  href={lastWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl mb-3 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reabrir WhatsApp (+54 9 3541 61-3365)</span>
                </a>
              )}
              <button
                onClick={() => {
                  clearCart();
                  setStep('cart');
                  setIsCartOpen(false);
                }}
                className="w-full py-3 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-semibold rounded-xl"
              >
                Volver a la Tienda
              </button>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-[#E3DBD0] bg-white">
            
            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-[#5F574A] mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="tabular-nums text-[#12231A] font-semibold">
                  {config.currency}{cartSubtotal.toLocaleString('es-AR')}
                </span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Descuento cupón (10%):</span>
                  <span className="tabular-nums">
                    -{config.currency}{couponDiscount.toLocaleString('es-AR')}
                  </span>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Descuento transferencia ({config.transferDiscountPercent}%):</span>
                  <span className="tabular-nums">
                    -{config.currency}{transferDiscount.toLocaleString('es-AR')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envío nacional:</span>
                <span className="text-[#12231A] font-bold">
                  {isFreeShipping ? '¡GRATIS!' : 'A coordinar'}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#12231A] pt-2 border-t border-[#ECE7DD]">
                <span>Total Final:</span>
                <span className="tabular-nums text-lg text-[#12231A]">
                  {config.currency}{totalAmount.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Step buttons */}
            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                <span>Continuar con los Datos de Envío</span>
                <ArrowRight className="w-4 h-4 text-[#C48F56]" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-xs font-bold rounded-xl"
                >
                  Volver
                </button>
                <button
                  onClick={handleSendOrderWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Pedido a WhatsApp</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C8374] mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#966336]" />
              <span>Atención artesanal directa desde Villa Carlos Paz</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
