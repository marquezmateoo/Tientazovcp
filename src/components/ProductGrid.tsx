import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { PlusCircle, Search, X } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'Todos', label: 'Todos' },
  { id: 'Mates', label: 'Mates' },
  { id: 'Bombillas', label: 'Bombillas' },
  { id: 'Yerbas', label: 'Yerbas' },
  { id: 'Combos', label: 'Combos' },
  { id: 'Canastas y Materas', label: 'Canastas' },
  { id: 'Yerberas', label: 'Yerberas' },
  { id: 'Termos', label: 'Termos' },
] as const;

export const ProductGrid: React.FC = () => {
  const { products, isAdminMode, openEditProductModal, activeCategory, setActiveCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          activeCategory === 'Todos' || product.category === activeCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.specs?.material || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, activeCategory, searchQuery, sortBy]);

  const activeTabObj = CATEGORY_TABS.find((t) => t.id === activeCategory);

  return (
    <section id="catalogo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-semibold tracking-wider text-[#966336] uppercase mb-2">
            Catálogo Oficial · TIENTAZO
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12231A] tracking-tight">
            {activeCategory === 'Todos'
              ? 'Nuestros Mates y Accesorios'
              : `Sector ${activeTabObj?.label || activeCategory}`}
          </h2>
          <p className="text-[#5F574A] text-sm mt-2 max-w-xl">
            Piezas nobles nacidas en Villa Carlos Paz. Cada mate y accesorio cuenta con materiales seleccionados y dedicación artesanal.
          </p>
        </div>

        {/* Add Product Button for Store Owner */}
        {isAdminMode && (
          <button
            onClick={() => openEditProductModal(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap self-start md:self-auto border border-[#C48F56]/30"
          >
            <PlusCircle className="w-4 h-4 text-[#C48F56]" />
            <span>Agregar Nuevo Producto</span>
          </button>
        )}
      </div>

      {/* Active Sector Indicator Banner */}
      {activeCategory !== 'Todos' && (
        <div className="mb-6 p-3.5 bg-[#FAF7F2] border border-[#DDD6C8] rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#12231A]">
            <span className="text-[#966336] font-semibold">Sector activo:</span>
            <span className="font-bold font-serif text-base">{activeTabObj?.label || activeCategory}</span>
            <span className="text-xs text-[#706757]">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados)
            </span>
          </div>
          <button
            onClick={() => setActiveCategory('Todos')}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-stone-100 text-[#12231A] text-xs font-semibold rounded-lg border border-[#DDD6C8] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Ver todos los sectores</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E3DBD0]">
        
        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#12231A] text-[#FAF7F2] shadow-sm font-semibold'
                    : 'bg-white text-[#5F574A] hover:text-[#12231A] border border-[#DDD6C8] hover:bg-[#F3EFE7]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Container */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8374]" />
            <input
              type="text"
              placeholder="Buscar mate, bombilla, cuero..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DDD6C8] rounded-xl text-[#12231A] placeholder-[#8C8374] focus:outline-none focus:border-[#12231A]"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-[#DDD6C8] rounded-xl px-3 py-2 text-[#464036] focus:outline-none focus:border-[#12231A]"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E3DBD0]">
          <p className="font-serif text-lg font-semibold text-[#12231A] mb-1">
            No encontramos productos con ese filtro
          </p>
          <p className="text-xs text-[#706757] mb-4">
            Probá seleccionando otro sector o restablecé la categoría para ver toda la colección de TIENTAZO.
          </p>
          <button
            onClick={() => {
              setActiveCategory('Todos');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#12231A] text-white rounded-xl text-xs font-semibold hover:bg-[#1E392A]"
          >
            Ver todos los productos
          </button>
        </div>
      )}

    </section>
  );
};
