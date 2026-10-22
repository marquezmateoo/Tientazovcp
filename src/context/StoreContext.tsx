import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StoreConfig, CartItem, Review, Order, OrderStatus } from '../types/store';
import { DEFAULT_CONFIG, DEFAULT_PRODUCTS, DEFAULT_REVIEWS, DEFAULT_ORDERS } from '../data/defaultStore';

interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: Partial<StoreConfig>) => void;
  resetConfig: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  resetProducts: () => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (id: string, status: OrderStatus, trackingNumber?: string, shippingCarrier?: string) => void;
  deleteOrder: (id: string) => void;
  resetOrders: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  isEditProductModalOpen: boolean;
  editingProductId: string | null;
  openEditProductModal: (id: string | null) => void;
  closeEditProductModal: () => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isSettingsDrawerOpen: boolean;
  setIsSettingsDrawerOpen: (open: boolean) => void;
  exportStoreData: () => void;
  importStoreData: (jsonString: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'tientazo_store_config_v3',
  PRODUCTS: 'tientazo_store_products_v3',
  ORDERS: 'tientazo_store_orders_v3',
  CART: 'tientazo_store_cart_v3',
  REVIEWS: 'tientazo_store_reviews_v3',
  ADMIN_MODE: 'tientazo_store_admin_mode_v3',
};

/**
 * Normalizes any Argentine phone number to the WhatsApp wa.me format:
 * e.g. "3541613365" -> "5493541613365"
 * "+5493541613365" -> "5493541613365"
 * "03541-613365" -> "5493541613365"
 */
export function normalizeWhatsAppNumber(rawPhone: string): string {
  let cleaned = (rawPhone || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '5493541613365';
  
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.length === 10) {
    // 10 digits (e.g., 3541613365)
    return `549${cleaned}`;
  }
  if (cleaned.startsWith('54') && !cleaned.startsWith('549') && cleaned.length === 12) {
    return `549${cleaned.substring(2)}`;
  }
  return cleaned;
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Config state
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Replace previous placeholder number if it contains 1234567 or doesn't have Mateo's number
        if (
          !parsed.whatsappNumber ||
          parsed.whatsappNumber.includes('1234567') ||
          !parsed.whatsappNumber.includes('3541613365')
        ) {
          parsed.whatsappNumber = DEFAULT_CONFIG.whatsappNumber;
        }
        // Ensure user's email is present
        if (
          !parsed.contactEmail ||
          parsed.contactEmail.includes('ejemplo.com') ||
          parsed.contactEmail.includes('tientazo.com')
        ) {
          parsed.contactEmail = DEFAULT_CONFIG.contactEmail;
        }
        if (
          !parsed.heroImage ||
          parsed.heroImage.includes('hero_artisan_mate_set') ||
          parsed.heroImage.includes('carpincho')
        ) {
          parsed.heroImage = DEFAULT_CONFIG.heroImage;
        }
        const merged = { ...DEFAULT_CONFIG, ...parsed };
        try {
          localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  });

  // Admin / Easy Edit Mode toggle
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, String(isAdminMode));
  }, [isAdminMode]);

  const updateConfig = (newConfig: Partial<StoreConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const id = 'prod-' + Date.now();
    const newProduct: Product = { ...newProdData, id };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Product = {
      ...target,
      id: 'prod-' + Date.now(),
      name: `${target.name} (Copia)`,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const resetProducts = () => {
    setProducts(DEFAULT_PRODUCTS);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Reciente',
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariant?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.selectedVariant || '') === (selectedVariant || '')
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [...prev, { product, quantity, selectedVariant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], quantity };
      }
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const openEditProductModal = (id: string | null) => {
    setEditingProductId(id);
    setIsEditProductModalOpen(true);
  };

  const closeEditProductModal = () => {
    setEditingProductId(null);
    setIsEditProductModalOpen(false);
  };

  // Orders Management
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const nextNum = 1000 + orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `TNZ-${nextNum}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus,
    trackingNumber?: string,
    shippingCarrier?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === id) {
          return {
            ...ord,
            status,
            ...(trackingNumber !== undefined ? { trackingNumber } : {}),
            ...(shippingCarrier !== undefined ? { shippingCarrier } : {}),
          };
        }
        return ord;
      })
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== id));
  };

  const resetOrders = () => {
    setOrders(DEFAULT_ORDERS);
  };

  // Export / Import
  const exportStoreData = () => {
    const backup = {
      config,
      products,
      orders,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tientazo_tienda_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importStoreData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.config) {
        setConfig(parsed.config);
      }
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        resetProducts,
        reviews,
        addReview,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        resetOrders,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isAdminMode,
        setIsAdminMode,
        isEditProductModalOpen,
        editingProductId,
        openEditProductModal,
        closeEditProductModal,
        selectedProductForDetail,
        setSelectedProductForDetail,
        activeCategory,
        setActiveCategory,
        isSettingsDrawerOpen,
        setIsSettingsDrawerOpen,
        exportStoreData,
        importStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
