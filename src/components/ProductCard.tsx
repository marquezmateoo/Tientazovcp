import React from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Edit2, Copy, Trash2, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { config, addToCart, isAdminMode, openEditProductModal, duplicateProduct, deleteProduct, setSelectedProductForDetail } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleOpenDetail = () => {
    setSelectedProductForDetail(product);
  };

  return (
    <article 
      onClick={handleOpenDetail}
      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E3DBD0] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Admin Action Overlay */}
      {isAdminMode && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#12231A]/95 text-white p-1 rounded-xl shadow-md backdrop-blur-sm border border-[#C48F56]/40"
        >
          <button
            onClick={() => openEditProductModal(product.id)}
            className="p-1.5 hover:bg-[#1E392A] rounded-lg text-[#C48F56]"
            title="Editar este producto"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => duplicateProduct(product.id)}
            className="p-1.5 hover:bg-[#1E392A] rounded-lg text-stone-300 hover:text-white"
            title="Duplicar producto"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
                deleteProduct(product.id);
              }
            }}
            className="p-1.5 hover:bg-red-900 rounded-lg text-stone-300 hover:text-red-300"
            title="Eliminar producto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EDE4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quiet Subtle Text Tag */}
        {product.tag && (
          <div className="absolute top-3 right-3 z-10 text-[11px] font-semibold tracking-wide uppercase px-3 py-1 bg-[#12231A]/90 text-[#F5EDE1] backdrop-blur-md rounded-lg border border-[#C48F56]/30">
            {product.tag}
          </div>
        )}

        {/* Quick actions on hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#12231A] hover:bg-[#1C3527] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#C48F56]" />
            <span>Agregar</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="p-2.5 bg-white/95 hover:bg-white text-[#12231A] rounded-xl shadow-md transition-colors"
            title="Ver detalles completos"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Category & Origin quiet metadata */}
        <div className="flex items-center gap-2 text-xs text-[#706757] mb-1.5">
          <span className="uppercase font-semibold tracking-wider text-[#966336]">
            {product.category}
          </span>
          <span aria-hidden="true" className="text-[#C48F56]/50">·</span>
          <span>{product.specs?.origen || 'Carlos Paz'}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#12231A] text-base leading-snug line-clamp-1 group-hover:text-[#966336] transition-colors mb-2">
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-[#5F574A] line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Price & Primary Action baseline */}
        <div className="pt-3 border-t border-[#EFEAE1] flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#12231A] tabular-nums">
              {config.currency}{product.price.toLocaleString('es-AR')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {config.currency}{product.originalPrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-[#966336] group-hover:text-[#12231A] group-hover:underline transition-colors">
            Ver detalle →
          </span>
        </div>

      </div>
    </article>
  );
};
