import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { IMAGE_PRESETS } from '../data/defaultStore';
import { Order, OrderStatus, PaymentMethod, ProductCategory, Product } from '../types/store';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Edit2,
  Trash2,
  Smartphone,
  MapPin,
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  ExternalLink,
  FileText,
  Maximize2,
  Minimize2,
  Search,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Layers,
  HelpCircle,
  Sliders,
  Terminal,
} from 'lucide-react';

export const AdminDrawer: React.FC = () => {
  const {
    config,
    updateConfig,
    resetConfig,
    products,
    addProduct,
    updateProduct,
    openEditProductModal,
    deleteProduct,
    resetProducts,
    orders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    resetOrders,
    isSettingsDrawerOpen,
    setIsSettingsDrawerOpen,
    isAdminMode,
    setIsAdminMode,
    exportStoreData,
    importStoreData,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'content' | 'images' | 'cms_guide' | 'settings'>('orders');
  const [isMaximized, setIsMaximized] = useState(false);
  const [formData, setFormData] = useState(config);
  const [saveFeedback, setSaveFeedback] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  // Orders Filter & Search state
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateManualOrderOpen, setIsCreateManualOrderOpen] = useState(false);

  // Tracking edit state for orders
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [shippingCarrierInput, setShippingCarrierInput] = useState('Andreani');

  // Products quick filter
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('Todos');

  // Manual Order Form state
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualCustomerCity, setManualCustomerCity] = useState('Villa Carlos Paz');
  const [manualCustomerAddress, setManualCustomerAddress] = useState('');
  const [manualSelectedProductId, setManualSelectedProductId] = useState(products[0]?.id || '');
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualPaymentMethod, setManualPaymentMethod] = useState<PaymentMethod>('transfer');
  const [manualStatus, setManualStatus] = useState<OrderStatus>('paid');
  const [manualNotes, setManualNotes] = useState('');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isSettingsDrawerOpen) return null;

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const query = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.toLowerCase().includes(query) ||
      (order.customerCity && order.customerCity.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  // Order Metrics
  const metrics = {
    totalRevenue: orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    pendingCount: orders.filter((o) => o.status === 'pending').length,
    paidCount: orders.filter((o) => o.status === 'paid').length,
    shippedCount: orders.filter((o) => o.status === 'shipped').length,
    deliveredCount: orders.filter((o) => o.status === 'delivered').length,
  };

  // Filtered Products for quick management
  const filteredProducts = products.filter((prod) => {
    const matchesCat = productCategoryFilter === 'Todos' || prod.category === productCategoryFilter;
    const matchesQuery = !productSearchQuery || prod.name.toLowerCase().includes(productSearchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importStoreData(content);
        if (success) {
          alert('¡Datos de la tienda y pedidos cargados exitosamente!');
        } else {
          alert('Hubo un error al leer el archivo JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualCustomerPhone.trim()) {
      alert('Por favor completá nombre y teléfono del cliente.');
      return;
    }

    const prod = products.find((p) => p.id === manualSelectedProductId) || products[0];
    if (!prod) return;

    const subtotal = prod.price * manualQuantity;
    const discount = manualPaymentMethod === 'transfer' ? subtotal * (config.transferDiscountPercent / 100) : 0;
    const total = subtotal - discount;

    createOrder({
      customerName: manualCustomerName.trim(),
      customerPhone: manualCustomerPhone.trim(),
      customerAddress: manualCustomerAddress.trim(),
      customerCity: manualCustomerCity.trim(),
      customerNotes: manualNotes.trim() || undefined,
      items: [
        {
          productId: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: manualQuantity,
          image: prod.image,
          category: prod.category,
        },
      ],
      subtotal,
      discount,
      shippingCost: 0,
      total,
      paymentMethod: manualPaymentMethod,
      status: manualStatus,
      shippingCarrier: manualCustomerCity.toLowerCase().includes('carlos paz') ? 'Retiro en Taller Carlos Paz' : 'Andreani',
    });

    setIsCreateManualOrderOpen(false);
    setManualCustomerName('');
    setManualCustomerPhone('');
    setManualCustomerAddress('');
    setManualNotes('');
  };

  // WhatsApp Notification generator for Orders
  const sendWhatsAppUpdateToClient = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    let text = '';

    if (order.status === 'shipped') {
      text = `¡Hola ${order.customerName}! 🧉 Te escribimos desde *TIENTAZO* (Villa Carlos Paz).
Te avisamos que tu pedido *#${order.orderNumber}* ya fue despachado por *${order.shippingCarrier || 'Andreani'}*.
${order.trackingNumber ? `📦 *Código de Seguimiento:* ${order.trackingNumber}\n` : ''}
¡Muchas gracias por elegirnos y que disfrutes las rondas de mate!`;
    } else if (order.status === 'paid') {
      text = `¡Hola ${order.customerName}! 🧉 Te confirmamos que recibimos el pago de tu pedido *#${order.orderNumber}* en *TIENTAZO*. Ya estamos preparando tus mates en nuestro taller de Carlos Paz. ¡Te avisamos apenas salga a despacho!`;
    } else {
      text = `¡Hola ${order.customerName}! 🧉 Te contactamos desde *TIENTAZO* por tu pedido *#${order.orderNumber}* por un total de ${config.currency}${order.total.toLocaleString('es-AR')}. ¿Te gustaría coordinar el pago por transferencia o retiro?`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // CSV Exporter for Tiendanube
  const exportTiendanubeCSV = () => {
    const headers = [
      'Identificador de URL',
      'Nombre',
      'Categorías',
      'Precio',
      'Precio promocional',
      'Stock',
      'Descripción',
      'Tags / Etiquetas',
      'Foto',
      'Publicado en la tienda',
      'Envío gratis',
    ];

    const rows = products.map((prod) => {
      const slug = prod.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const cleanDesc = (prod.description || '').replace(/"/g, '""');
      return [
        `"${slug}"`,
        `"${prod.name.replace(/"/g, '""')}"`,
        `"${prod.category}"`,
        `"${prod.price}"`,
        `"${prod.originalPrice || ''}"`,
        `"${prod.stockCount || 10}"`,
        `"${cleanDesc}"`,
        `"${prod.tag || ''}"`,
        `"${prod.image || ''}"`,
        `"SI"`,
        `"${prod.price >= (config.freeShippingThreshold || 45000) ? 'SI' : 'NO'}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `catalogo_tientazo_tiendanube_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // CSV Exporter for WooCommerce
  const exportWooCommerceCSV = () => {
    const headers = [
      'ID',
      'Tipo',
      'SKU',
      'Nombre',
      'Publicado',
      '¿Está destacado?',
      'Visibilidad en el catálogo',
      'Descripción corta',
      'Descripción',
      'Precio normal',
      'Precio rebajado',
      'Categorías',
      'Etiquetas',
      'Imágenes',
      'Inventario',
    ];

    const rows = products.map((prod, index) => {
      return [
        `"${index + 1}"`,
        `"simple"`,
        `"${prod.id}"`,
        `"${prod.name.replace(/"/g, '""')}"`,
        `"1"`,
        `"${prod.featured ? '1' : '0'}"`,
        `"visible"`,
        `"${(prod.features || []).join(' · ').replace(/"/g, '""')}"`,
        `"${(prod.description || '').replace(/"/g, '""')}"`,
        `"${prod.originalPrice || prod.price}"`,
        `"${prod.originalPrice ? prod.price : ''}"`,
        `"${prod.category}"`,
        `"${prod.tag || ''}"`,
        `"${prod.image}"`,
        `"${prod.stockCount || 10}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `catalogo_tientazo_woocommerce_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3" />
            <span>Pendiente</span>
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle className="w-3 h-3" />
            <span>Pagado / Preparando</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Truck className="w-3 h-3" />
            <span>Despachado</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <Check className="w-3 h-3" />
            <span>Entregado</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700">
            <X className="w-3 h-3" />
            <span>Cancelado</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm flex justify-end">
      <div
        className={`relative bg-[#FAF8F3] shadow-2xl flex flex-col h-full border-l border-[#D5C9B5] transition-all duration-300 ${
          isMaximized ? 'w-full' : 'w-full max-w-2xl sm:max-w-3xl'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E3DBD0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#12231A] text-[#C48F56] flex items-center justify-center font-serif font-bold text-lg shadow-xs">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#12231A]">
                  Panel de Control & CMS TIENTAZO
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EFE9DE] text-[#966336] uppercase">
                  Carlos Paz
                </span>
              </div>
              <p className="text-xs text-[#706757]">
                Gestión integral de pedidos, catálogo de productos, fotos y contenidos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title={isMaximized ? 'Contraer a panel lateral' : 'Pantalla completa'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsSettingsDrawerOpen(false)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label="Cerrar panel de control"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Toggle Banner */}
        <div className="bg-[#12231A] text-white px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C48F56]" />
            <div>
              <span className="font-bold text-[#FAF7F2]">Modo Edición en Vivo:</span>{' '}
              <span className="text-stone-300 text-[11px]">
                {isAdminMode
                  ? 'Botones de edición rápida visibles sobre los productos en la web.'
                  : 'Navegación normal como cliente.'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
              isAdminMode
                ? 'bg-[#C48F56] text-stone-950 shadow-sm'
                : 'bg-stone-800 text-stone-200 border border-stone-700 hover:bg-stone-700'
            }`}
          >
            {isAdminMode ? 'Edición Activa' : 'Activar Edición'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3DBD0] bg-white px-4 text-xs font-semibold overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#12231A] text-[#12231A] font-bold'
                : 'border-transparent text-[#706757] hover:text-[#12231A]'
            }`}
          >
            <Package className="w-4 h-4 text-[#C48F56]" />
            <span>Pedidos ({orders.length})</span>
            {metrics.pendingCount > 0 && (
              <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {metrics.pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-[#12231A] text-[#12231A] font-bold'
                : 'border-transparent text-[#706757] hover:text-[#12231A]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'border-[#12231A] text-[#12231A] font-bold'
                : 'border-transparent text-[#706757] hover:text-[#12231A]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Textos & Portada</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`py-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'images'
                ? 'border-[#12231A] text-[#12231A] font-bold'
                : 'border-transparent text-[#706757] hover:text-[#12231A]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Fotos & Galería</span>
          </button>

          <button
            onClick={() => setActiveTab('cms_guide')}
            className={`py-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cms_guide'
                ? 'border-[#12231A] text-[#12231A] font-bold'
                : 'border-transparent text-[#706757] hover:text-[#12231A]'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-[#966336]" />
            <span>Integración CMS (Tiendanube/Woo)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-[#12231A] text-[#12231A] font-bold'
                : 'border-transparent text-[#706757] hover:text-[#12231A]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>WhatsApp & Respaldos</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* =========================================================================
              TAB 1: GESTIÓN DE PEDIDOS (ORDERS CMS)
             ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Top KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-[#E3DBD0] shadow-2xs">
                  <span className="text-[11px] text-[#706757] font-semibold block">Ventas Registradas</span>
                  <p className="font-serif text-lg font-bold text-[#12231A] mt-1">
                    {config.currency}{metrics.totalRevenue.toLocaleString('es-AR')}
                  </p>
                  <span className="text-[10px] text-emerald-800 font-bold">{metrics.totalOrders} pedidos totales</span>
                </div>

                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
                  <span className="text-[11px] text-amber-900 font-semibold block">Pendientes de Pago</span>
                  <p className="font-serif text-lg font-bold text-amber-950 mt-1">
                    {metrics.pendingCount}
                  </p>
                  <span className="text-[10px] text-amber-800">A confirmar transferencia</span>
                </div>

                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <span className="text-[11px] text-emerald-900 font-semibold block">Listos / Pagados</span>
                  <p className="font-serif text-lg font-bold text-emerald-950 mt-1">
                    {metrics.paidCount}
                  </p>
                  <span className="text-[10px] text-emerald-800">A embalar y despachar</span>
                </div>

                <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/80 shadow-2xs">
                  <span className="text-[11px] text-blue-900 font-semibold block">Despachados</span>
                  <p className="font-serif text-lg font-bold text-blue-950 mt-1">
                    {metrics.shippedCount}
                  </p>
                  <span className="text-[10px] text-blue-800">Con guía de seguimiento</span>
                </div>
              </div>

              {/* Action Bar & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Buscar por cliente, teléfono, N° de pedido o ciudad..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#D5C9B5] rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#12231A]"
                  />
                </div>

                <button
                  onClick={() => setIsCreateManualOrderOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#C48F56]" />
                  <span>+ Cargar Pedido Manual</span>
                </button>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
                {(['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      orderStatusFilter === status
                        ? 'bg-[#12231A] text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-[#D5C9B5] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    {status === 'all' && `Todos (${orders.length})`}
                    {status === 'pending' && `Pendientes (${metrics.pendingCount})`}
                    {status === 'paid' && `Pagados (${metrics.paidCount})`}
                    {status === 'shipped' && `Despachados (${metrics.shippedCount})`}
                    {status === 'delivered' && `Entregados (${metrics.deliveredCount})`}
                    {status === 'cancelled' && `Cancelados`}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D5C9B5]">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-stone-700">No se encontraron pedidos con este filtro</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Los pedidos que hagan los clientes en la tienda o por WhatsApp aparecerán aquí automáticamente.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#E3DBD0] p-4 shadow-2xs hover:border-[#C48F56]/60 transition-colors space-y-3"
                    >
                      {/* Top Row: Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE7DD] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#12231A] bg-[#FAF8F3] px-2.5 py-1 rounded-lg border border-[#D5C9B5]">
                            #{order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                          <span className="text-[11px] text-stone-400">
                            {new Date(order.createdAt).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#12231A]">
                            {config.currency}{order.total.toLocaleString('es-AR')}
                          </span>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar el registro del pedido #${order.orderNumber}?`)) {
                                deleteOrder(order.id);
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-red-700 rounded-md"
                            title="Eliminar pedido"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle Row: Customer Info & Items */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Customer */}
                        <div className="space-y-1">
                          <p className="font-bold text-[#12231A] text-sm">{order.customerName}</p>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Smartphone className="w-3.5 h-3.5 text-[#C48F56]" />
                            <span className="font-mono">{order.customerPhone}</span>
                            <button
                              onClick={() => sendWhatsAppUpdateToClient(order)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                              title="Abrir chat de WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-700" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                          {order.customerCity && (
                            <div className="flex items-center gap-1.5 text-stone-600 text-[11px]">
                              <MapPin className="w-3.5 h-3.5 text-stone-400" />
                              <span>{order.customerAddress ? `${order.customerAddress}, ` : ''}{order.customerCity}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-[#706757]">
                            <span className="font-semibold">Pago:</span>{' '}
                            {order.paymentMethod === 'transfer' ? 'Transferencia (15% OFF)' : order.paymentMethod === 'card' ? 'Tarjeta / Mercado Pago' : 'Efectivo en Taller'}
                          </div>
                          {order.customerNotes && (
                            <p className="text-[11px] italic text-stone-600 bg-[#F9F6F0] p-1.5 rounded-lg border border-[#E8E1D5]">
                              "{order.customerNotes}"
                            </p>
                          )}
                        </div>

                        {/* Items list */}
                        <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#E3DBD0] space-y-2">
                          <span className="font-semibold text-[11px] text-[#12231A] block">
                            Productos ({order.items.reduce((s, i) => s + i.quantity, 0)} u.)
                          </span>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                                <div className="flex items-center gap-2 truncate">
                                  {item.image && (
                                    <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover shrink-0" />
                                  )}
                                  <span className="font-medium text-stone-800 truncate">{item.name}</span>
                                  <span className="text-stone-500 font-bold shrink-0">x{item.quantity}</span>
                                </div>
                                <span className="font-mono text-stone-800 font-semibold shrink-0">
                                  {config.currency}{(item.price * item.quantity).toLocaleString('es-AR')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Status Dropdown & Shipping Tracking Control */}
                      <div className="pt-2 border-t border-[#ECE7DD] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-700">Cambiar estado:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-white border border-[#D5C9B5] rounded-xl px-2.5 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#12231A]"
                          >
                            <option value="pending">⏳ Pendiente de pago</option>
                            <option value="paid">✅ Pagado (Preparando)</option>
                            <option value="shipped">🚚 Despachado (En camino)</option>
                            <option value="delivered">📦 Entregado al cliente</option>
                            <option value="cancelled">❌ Cancelado</option>
                          </select>
                        </div>

                        {/* Tracking Guide Editor */}
                        <div className="flex items-center gap-2">
                          {editingTrackingId === order.id ? (
                            <div className="flex items-center gap-1.5">
                              <select
                                value={shippingCarrierInput}
                                onChange={(e) => setShippingCarrierInput(e.target.value)}
                                className="bg-white border border-[#D5C9B5] rounded-lg text-[11px] p-1"
                              >
                                <option value="Andreani">Andreani</option>
                                <option value="Correo Argentino">Correo Argentino</option>
                                <option value="OCA">OCA</option>
                                <option value="Retiro en Taller Carlos Paz">Retiro en Taller</option>
                              </select>
                              <input
                                type="text"
                                value={trackingNumberInput}
                                onChange={(e) => setTrackingNumberInput(e.target.value)}
                                placeholder="N° de Guía / Envío"
                                className="bg-white border border-[#D5C9B5] rounded-lg text-[11px] p-1 w-28 font-mono"
                              />
                              <button
                                onClick={() => {
                                  updateOrderStatus(order.id, order.status, trackingNumberInput, shippingCarrierInput);
                                  setEditingTrackingId(null);
                                }}
                                className="px-2 py-1 bg-[#12231A] text-[#C48F56] text-[11px] font-bold rounded-lg"
                              >
                                Guardar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {order.trackingNumber ? (
                                <span className="font-mono text-[11px] bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md">
                                  {order.shippingCarrier || 'Guía'}: {order.trackingNumber}
                                </span>
                              ) : (
                                <span className="text-[11px] text-stone-400">Sin guía cargada</span>
                              )}
                              <button
                                onClick={() => {
                                  setEditingTrackingId(order.id);
                                  setTrackingNumberInput(order.trackingNumber || '');
                                  setShippingCarrierInput(order.shippingCarrier || 'Andreani');
                                }}
                                className="text-[11px] font-bold text-[#966336] hover:underline"
                              >
                                {order.trackingNumber ? 'Editar Guía' : '+ Cargar Guía'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: GESTIÓN DE PRODUCTOS (CATÁLOGO & PRECIOS)
             ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4 text-xs">
              
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      placeholder="Buscar producto por nombre..."
                      className="w-full pl-8 pr-3 py-2 bg-white border border-[#D5C9B5] rounded-xl text-xs text-stone-800"
                    />
                  </div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-white border border-[#D5C9B5] rounded-xl px-3 py-2 text-xs font-semibold text-stone-800"
                  >
                    <option value="Todos">Todas las categorías</option>
                    <option value="Mates">Mates</option>
                    <option value="Bombillas">Bombillas</option>
                    <option value="Termos">Termos</option>
                    <option value="Canastas y Materas">Canastas y Materas</option>
                    <option value="Yerberas">Yerberas</option>
                    <option value="Combos">Combos</option>
                    <option value="Yerbas">Yerbas</option>
                  </select>
                </div>

                <button
                  onClick={() => openEditProductModal(null)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#C48F56]" />
                  <span>+ Agregar Producto</span>
                </button>
              </div>

              {/* Products Table / Cards */}
              <div className="space-y-2.5">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E3DBD0] shadow-2xs hover:border-[#C48F56]/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-14 h-14 rounded-xl object-cover bg-[#F0EAE0] shrink-0 border border-[#E8E1D5]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F3] text-[#966336] border border-[#E3DBD0]">
                            {prod.category}
                          </span>
                          {prod.tag && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                              {prod.tag}
                            </span>
                          )}
                          {!prod.inStock && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800">
                              Sin Stock
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-[#12231A] text-sm mt-0.5 truncate">{prod.name}</h4>
                        <p className="text-[11px] text-stone-500 truncate max-w-sm">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    {/* Quick inline price edit & stock toggle */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-stone-500">Precio:</span>
                        <div className="flex items-center bg-[#FAF8F3] border border-[#D5C9B5] rounded-lg px-2 py-1">
                          <span className="font-bold text-stone-500 mr-0.5">{config.currency}</span>
                          <input
                            type="number"
                            value={prod.price}
                            onChange={(e) => updateProduct(prod.id, { price: Number(e.target.value) })}
                            className="w-20 bg-transparent font-mono font-bold text-xs text-[#12231A] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            prod.inStock ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                          }`}
                          title="Alternar disponibilidad de stock"
                        >
                          {prod.inStock ? 'En Stock' : 'Agotado'}
                        </button>
                        <button
                          onClick={() => openEditProductModal(prod.id)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                          title="Editar detalles completos"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar ${prod.name}?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 3: TEXTOS, PORTADA & CURADO (CMS DE CONTENIDOS)
             ========================================================================= */}
          {activeTab === 'content' && (
            <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
              
              <div className="bg-white p-4 rounded-2xl border border-[#E3DBD0] space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#12231A] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C48F56]" />
                  <span>Identidad de Marca & Textos de Portada</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Nombre de la Marca</label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Slogan</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Ubicación del Taller</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Etiqueta Superior Portada</label>
                    <input
                      type="text"
                      value={formData.heroBadge}
                      onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#12231A] mb-1">Barra Superior de Anuncios</label>
                  <textarea
                    rows={2}
                    value={formData.announcement}
                    onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                    className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#12231A] mb-1">Título Principal (Hero)</label>
                  <input
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#12231A] mb-1">Descripción / Subtítulo</label>
                  <textarea
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 leading-relaxed"
                  />
                </div>
              </div>

              {/* Botón de Guardar */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4 text-[#C48F56]" />
                  <span>Guardar Textos en la Web</span>
                </button>
                {saveFeedback && (
                  <p className="text-center text-emerald-800 font-bold mt-2">
                    ✓ Modificaciones guardadas correctamente
                  </p>
                )}
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 4: IMÁGENES & GALERÍA (HERO IMAGE & UPLOAD)
             ========================================================================= */}
          {activeTab === 'images' && (
            <div className="space-y-5 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#E3DBD0] space-y-4">
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#12231A] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C48F56]" />
                    <span>Foto Principal de Portada (Hero Showcase)</span>
                  </h3>
                  <p className="text-[#706757] text-[11px] mt-0.5">
                    Esta es la foto fotográfica real que se muestra en el inicio de la tienda sin carteles encima.
                  </p>
                </div>

                {/* Live Preview */}
                <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-[#D5C9B5] bg-stone-100 shadow-inner">
                  <img
                    src={formData.heroImage}
                    alt="Vista previa de portada"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    Foto Activa
                  </span>
                </div>

                {/* Subir archivo desde PC */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4 text-[#C48F56]" />
                    <span>Subir foto desde tu dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              const dataUrl = ev.target.result as string;
                              setFormData({ ...formData, heroImage: dataUrl });
                              updateConfig({ heroImage: dataUrl });
                              alert('¡Foto de portada actualizada exitosamente!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Presets oficiales de la marca */}
                <div>
                  <label className="block font-semibold text-[#12231A] mb-2">
                    O elegí una de las fotos predefinidas de alta calidad:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, heroImage: preset.path });
                          updateConfig({ heroImage: preset.path });
                        }}
                        className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 text-left transition-all ${
                          formData.heroImage === preset.path
                            ? 'border-[#12231A] ring-2 ring-[#C48F56]'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.path} alt={preset.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-white text-[9px] p-1 truncate">
                          {preset.title}
                        </span>
                        {formData.heroImage === preset.path && (
                          <div className="absolute top-1.5 right-1.5 bg-[#12231A] text-[#C48F56] rounded-full p-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL manual */}
                <div>
                  <label className="block font-semibold text-[#12231A] mb-1">O pegar URL directa:</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: RECOMENDACIÓN E INTEGRACIÓN CMS (TIENDANUBE / WOOCOMMERCE / SHOPIFY)
             ========================================================================= */}
          {activeTab === 'cms_guide' && (
            <div className="space-y-6 text-xs">
              
              {/* Recomendación Destacada */}
              <div className="bg-gradient-to-br from-[#12231A] to-[#1C3527] text-white p-5 rounded-3xl shadow-lg border border-[#C48F56]/40 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C48F56] text-stone-950">
                    ⭐ RECOMENDACIÓN N° 1 PARA ARGENTINA
                  </span>
                  <span className="text-stone-300 text-xs">Villa Carlos Paz</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">
                  ¿Qué CMS conviene elegir para TIENTAZO?
                </h3>
                <p className="text-stone-200 text-xs leading-relaxed">
                  Para una tienda de mates artesanales que recién arranca en Villa Carlos Paz con envíos nacionales,
                  <strong> Tiendanube es la opción más sólida y rentable</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-[#E5BC8E] block">Mercado Pago Nativo</span>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Cobros con 3 y 6 cuotas sin interés y dinero en cuenta sin configuraciones complejas.
                    </p>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-[#E5BC8E] block">Correo Argentino & Andreani</span>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Cálculo de envíos por código postal e impresión de etiquetas con un solo click.
                    </p>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-[#E5BC8E] block">Costo en Pesos (ARS)</span>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Planes económicos en pesos argentinos sin comisiones sorpresa en dólares (como Shopify).
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparativa Detallada de Plataformas */}
              <div className="bg-white p-5 rounded-3xl border border-[#E3DBD0] space-y-4">
                <h4 className="font-serif text-base font-bold text-[#12231A]">
                  Comparativa de CMS para la Venta de Mates
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tiendanube */}
                  <div className="p-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#12231A]">1. Tiendanube (Recomendado)</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">9.8/10</span>
                    </div>
                    <ul className="text-[11px] text-stone-700 space-y-1 list-disc pl-4">
                      <li>Totalmente adaptada al mercado argentino (pesos, cuotas, DNI, provincias).</li>
                      <li>Integración directa con WhatsApp para atención personalizada de mates.</li>
                      <li>Compatible con el importador de catálogo en CSV que podés descargar abajo.</li>
                      <li>Plataforma elegida por tiendas de referencia como <em>Argentino Límite</em>.</li>
                    </ul>
                  </div>

                  {/* WooCommerce / WordPress */}
                  <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#12231A]">2. WooCommerce (WordPress)</span>
                      <span className="text-[10px] font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded-md">8.2/10</span>
                    </div>
                    <ul className="text-[11px] text-stone-700 space-y-1 list-disc pl-4">
                      <li>Control total y sin costo mensual de software si ya tenés hosting.</li>
                      <li>Requiere mantenimiento técnico periódico (actualización de plugins y seguridad).</li>
                      <li>Configuración manual de plugins para Mercado Pago y Andreani.</li>
                    </ul>
                  </div>

                  {/* Shopify */}
                  <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#12231A]">3. Shopify</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">7.5/10</span>
                    </div>
                    <ul className="text-[11px] text-stone-700 space-y-1 list-disc pl-4">
                      <li>Líder mundial en ecommerce con excelente estabilidad.</li>
                      <li><strong>Desventaja en Argentina:</strong> Cobra en dólares (~USD 39/mes) + comisiones por venta adicionales.</li>
                      <li>La logística argentina (Correo/Andreani) suele requerir apps de pago extra.</li>
                    </ul>
                  </div>

                  {/* Squarespace */}
                  <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#12231A]">4. Squarespace</span>
                      <span className="text-[10px] font-bold bg-red-100 text-red-900 px-2 py-0.5 rounded-md">5.5/10</span>
                    </div>
                    <ul className="text-[11px] text-stone-700 space-y-1 list-disc pl-4">
                      <li>Diseños muy atractivos visualmente para fotógrafos o portfolios.</li>
                      <li><strong>No apto para comercio en Argentina:</strong> no soporta pasarelas de pago locales ni cálculo de envíos nacionales.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Herramientas de Exportación para Migración / Sincronización */}
              <div className="bg-white p-5 rounded-3xl border border-[#E3DBD0] space-y-4">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#12231A] flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#C48F56]" />
                    <span>Exportar Catálogo de TIENTAZO para Importación Inmediata</span>
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Descargá tus {products.length} mates y productos en formato compatible con cualquier CMS para no tener que cargarlos de nuevo a mano.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 bg-[#FAF8F3] rounded-2xl border border-[#D5C9B5] space-y-2">
                    <span className="font-bold text-[#12231A] block">Formato Tiendanube (CSV)</span>
                    <p className="text-[11px] text-stone-600">
                      Incluye columnas exactas: Nombre, Categoría, Precio, Precio de oferta, Stock, Fotos y Descripción.
                    </p>
                    <button
                      onClick={exportTiendanubeCSV}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C48F56]" />
                      <span>Descargar CSV para Tiendanube</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[#FAF8F3] rounded-2xl border border-[#D5C9B5] space-y-2">
                    <span className="font-bold text-[#12231A] block">Formato WooCommerce (CSV)</span>
                    <p className="text-[11px] text-stone-600">
                      Compatible con el importador estándar de WordPress WooCommerce con SKU y atributos.
                    </p>
                    <button
                      onClick={exportWooCommerceCSV}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C48F56]" />
                      <span>Descargar CSV para WooCommerce</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Guía Directa de Exportación a GitHub */}
              <div className="bg-white p-5 rounded-3xl border border-[#E3DBD0] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#12231A] flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-stone-900 text-white">
                        <Terminal className="w-4 h-4" />
                      </span>
                      <span>Exportar el Código a tu GitHub</span>
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-1">
                      El proyecto está 100% limpio y optimizado con <strong>Vite + React 19 + TypeScript + Tailwind CSS</strong> para subir a tu repositorio sin complicaciones.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const commands = `git init\ngit add .\ngit commit -m "Tienda Tientazo - Mates Artesanales de Carlos Paz"\ngit branch -M main\ngit remote add origin https://github.com/TU_USUARIO/tientazo-tienda.git\ngit push -u origin main`;
                      navigator.clipboard.writeText(commands);
                      setCopiedId('github-commands');
                      setTimeout(() => setCopiedId(null), 2500);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F0EAE0] border border-[#D5C9B5] rounded-xl text-stone-800 text-[11px] font-bold transition-colors shrink-0"
                  >
                    {copiedId === 'github-commands' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-emerald-800">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C48F56]" />
                        <span>Copiar Comandos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-[11px] space-y-1.5 overflow-x-auto shadow-inner">
                  <p className="text-stone-400"># 1. En la terminal de tu proyecto descargado:</p>
                  <p className="text-emerald-400">git init</p>
                  <p className="text-emerald-400">git add .</p>
                  <p className="text-emerald-400">git commit -m &quot;Tienda Tientazo - Mates Villa Carlos Paz&quot;</p>
                  <p className="text-stone-400 pt-1"># 2. Conectá con tu repositorio en GitHub:</p>
                  <p className="text-emerald-400">git branch -M main</p>
                  <p className="text-emerald-400">git remote add origin https://github.com/TU_USUARIO/tientazo-tienda.git</p>
                  <p className="text-emerald-400">git push -u origin main</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-950 block">Despliegue Gratis en Vercel</span>
                    <p className="text-[11px] text-emerald-900/80 mt-0.5">
                      1. Entrá a <strong>vercel.com</strong> e iniciá sesión con GitHub.<br />
                      2. Hacé click en <strong>Import Project</strong> y seleccioná tu repo.<br />
                      3. Click en <strong>Deploy</strong> y ¡listo tu sitio online en 30 seg!
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-950 block">Despliegue Gratis en Netlify</span>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      1. Entrá a <strong>netlify.com</strong>.<br />
                      2. Elegí <strong>Import from Git</strong>.<br />
                      3. Configuración automática: Build: <code className="bg-amber-100 px-1 rounded">npm run build</code>, Dir: <code className="bg-amber-100 px-1 rounded">dist</code>.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 6: WHATSAPP, PAGOS & RESPALDOS
             ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 text-xs">
              
              <form onSubmit={handleSaveConfig} className="bg-white p-4 rounded-2xl border border-[#E3DBD0] space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#12231A] flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#C48F56]" />
                  <span>Configuración de WhatsApp y Datos Bancarios</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">
                      WhatsApp para Pedidos *
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      placeholder="+5493541613365"
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 font-mono"
                    />
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Tu número: 3541613365 (con +549 para WhatsApp).
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="marquezmateo219@gmail.com"
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Email oficial de Mateo Márquez.
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Instagram (@usuario)</label>
                    <input
                      type="text"
                      value={formData.instagramHandle}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Perfil en Instagram.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Monto para Envío Gratis ({config.currency})</label>
                    <input
                      type="number"
                      value={formData.freeShippingThreshold}
                      onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">% Descuento por Transferencia</label>
                    <input
                      type="number"
                      value={formData.transferDiscountPercent}
                      onChange={(e) => setFormData({ ...formData, transferDiscountPercent: Number(e.target.value) })}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Alias / CBU para Cobrar</label>
                    <input
                      type="text"
                      value={formData.aliasCbu}
                      onChange={(e) => setFormData({ ...formData, aliasCbu: e.target.value })}
                      placeholder="TIENTAZO.MATES.MP"
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Banco / Billetera</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="Mercado Pago / Banco de Córdoba"
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4 text-[#C48F56]" />
                  <span>Guardar WhatsApp y Finanzas</span>
                </button>
              </form>

              {/* Copia de Seguridad */}
              <div className="bg-white p-4 rounded-2xl border border-[#E3DBD0] space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#12231A] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C48F56]" />
                  <span>Respaldo y Restauración de Datos</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#D5C9B5] space-y-2">
                    <span className="font-bold text-[#12231A]">Descargar Respaldo Completo</span>
                    <p className="text-[11px] text-stone-600">
                      Guarda productos, textos, imágenes y todos los pedidos en un archivo JSON en tu PC.
                    </p>
                    <button
                      onClick={exportStoreData}
                      className="w-full py-2 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl text-xs"
                    >
                      Descargar JSON
                    </button>
                  </div>

                  <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#D5C9B5] space-y-2">
                    <span className="font-bold text-[#12231A]">Restaurar desde Archivo</span>
                    <p className="text-[11px] text-stone-600">
                      Recupera una copia guardada previamente en tu computadora.
                    </p>
                    <label className="block w-full py-2 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-center font-bold rounded-xl cursor-pointer border border-dashed border-[#D5C9B5]">
                      Seleccionar archivo JSON
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-red-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-red-950 block">Restablecer valores de muestra</span>
                    <span className="text-[11px] text-red-700">Recarga el catálogo original de Carlos Paz.</span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('¿Deseas restablecer los productos y textos a los valores originales de TIENTAZO?')) {
                        resetConfig();
                        resetProducts();
                        resetOrders();
                        setFormData(config);
                        alert('Tienda restablecida con éxito.');
                      }
                    }}
                    className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white font-semibold rounded-xl text-xs"
                  >
                    Restablecer
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal: + Cargar Pedido Manual */}
        {isCreateManualOrderOpen && (
          <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF8F3] w-full max-w-lg rounded-3xl border border-[#D5C9B5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 bg-white border-b border-[#E3DBD0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#12231A]" />
                  <h3 className="font-serif font-bold text-base text-[#12231A]">
                    Registrar Pedido Manual (Taller / Redes)
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateManualOrderOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="p-5 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Nombre del Cliente *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerName}
                      onChange={(e) => setManualCustomerName(e.target.value)}
                      placeholder="Ej: Marcos Valenzuela"
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Teléfono WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerPhone}
                      onChange={(e) => setManualCustomerPhone(e.target.value)}
                      placeholder="+5493541..."
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={manualCustomerCity}
                      onChange={(e) => setManualCustomerCity(e.target.value)}
                      placeholder="Villa Carlos Paz"
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Dirección / Punto de Retiro</label>
                    <input
                      type="text"
                      value={manualCustomerAddress}
                      onChange={(e) => setManualCustomerAddress(e.target.value)}
                      placeholder="Retira en taller o calle..."
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#12231A] mb-1">Seleccionar Mate / Producto</label>
                  <select
                    value={manualSelectedProductId}
                    onChange={(e) => setManualSelectedProductId(e.target.value)}
                    className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({config.currency}{p.price.toLocaleString('es-AR')})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(Number(e.target.value))}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Forma de Pago</label>
                    <select
                      value={manualPaymentMethod}
                      onChange={(e) => setManualPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800"
                    >
                      <option value="transfer">Transferencia</option>
                      <option value="cash">Efectivo / Taller</option>
                      <option value="card">Tarjeta / MP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#12231A] mb-1">Estado</label>
                    <select
                      value={manualStatus}
                      onChange={(e) => setManualStatus(e.target.value as OrderStatus)}
                      className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800"
                    >
                      <option value="paid">✅ Pagado</option>
                      <option value="pending">⏳ Pendiente</option>
                      <option value="shipped">🚚 Despachado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#12231A] mb-1">Notas Internas</label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    placeholder="Ej: Vendido por Instagram / Retira mañana"
                    className="w-full bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800"
                  />
                </div>

                <div className="pt-3 border-t border-[#E3DBD0] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateManualOrderOpen(false)}
                    className="px-4 py-2 bg-stone-200 text-stone-700 font-semibold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#12231A] hover:bg-[#1E392A] text-white font-bold rounded-xl shadow-xs"
                  >
                    Guardar Pedido
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
