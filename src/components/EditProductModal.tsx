import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { IMAGE_PRESETS } from '../data/defaultStore';
import { Product } from '../types/store';
import { X, Check, Trash2, Upload } from 'lucide-react';

export const EditProductModal: React.FC = () => {
  const { isEditProductModalOpen, editingProductId, closeEditProductModal, products, addProduct, updateProduct, config } = useStore();

  const isNew = editingProductId === null;
  const existingProduct = products.find((p) => p.id === editingProductId);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Mates');
  const [price, setPrice] = useState(35000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(42000);
  const [tag, setTag] = useState('');
  const [image, setImage] = useState(IMAGE_PRESETS[0].path);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['Calabaza natural seleccionada', 'Cuero vacuno genuino con tiento']);
  const [newFeature, setNewFeature] = useState('');
  const [material, setMaterial] = useState('Calabaza natural y cuero vacuno');
  const [virola, setVirola] = useState('Alpaca maciza cincelada');
  const [capacidad, setCapacidad] = useState('35 a 45 gramos');
  const [origen, setOrigen] = useState('Villa Carlos Paz, Córdoba');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setCategory(existingProduct.category);
      setPrice(existingProduct.price);
      setOriginalPrice(existingProduct.originalPrice);
      setTag(existingProduct.tag || '');
      setImage(existingProduct.image);
      setDescription(existingProduct.description);
      setFeatures(existingProduct.features || []);
      setMaterial(existingProduct.specs?.material || '');
      setVirola(existingProduct.specs?.virola || '');
      setCapacidad(existingProduct.specs?.capacidad || '');
      setOrigen(existingProduct.specs?.origen || '');
      setFeatured(existingProduct.featured ?? false);
    } else {
      setName('Nuevo Mate Criollo Tientazo');
      setCategory('Mates');
      setPrice(39000);
      setOriginalPrice(45000);
      setTag('Nuevo');
      setImage(IMAGE_PRESETS[0].path);
      setDescription('Mate artesanal de calabaza seleccionada con cuero vacuno cosido con tiento y virola metálica noble.');
      setFeatures([
        'Calabaza natural de paredes gruesas',
        'Costuras con tiento auténtico reforzado',
        'Virola de metal noble pulida a mano',
      ]);
      setMaterial('Calabaza y cuero vacuno');
      setVirola('Alpaca cincelada');
      setCapacidad('35g de yerba');
      setOrigen('Villa Carlos Paz, Córdoba');
      setFeatured(false);
    }
  }, [existingProduct, isEditProductModalOpen]);

  if (!isEditProductModalOpen) return null;

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresá el nombre del producto.');
      return;
    }

    const payload = {
      name: name.trim(),
      category,
      price: Number(price) || 0,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      tag: tag.trim() || undefined,
      image,
      description: description.trim(),
      features,
      specs: {
        material,
        virola,
        capacidad,
        origen,
      },
      inStock: true,
      stockCount: 10,
      featured,
    };

    if (isNew) {
      addProduct(payload);
    } else if (editingProductId) {
      updateProduct(editingProductId, payload);
    }

    closeEditProductModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FAF8F3] rounded-3xl shadow-2xl border border-[#D5C9B5] overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E3DBD0] flex items-center justify-between bg-white">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#12231A]">
              {isNew ? 'Agregar Nuevo Mate a TIENTAZO' : 'Editar Producto'}
            </h3>
            <p className="text-xs text-[#706757] mt-0.5">
              Modificá el precio, foto, descripción y especificaciones de tu mate.
            </p>
          </div>
          <button
            onClick={closeEditProductModal}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Mate Imperial Cuero Negro"
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
              >
                <option value="Mates">Mates</option>
                <option value="Bombillas">Bombillas</option>
                <option value="Yerbas">Yerbas</option>
                <option value="Combos">Combos</option>
                <option value="Canastas y Materas">Canastas y Materas</option>
                <option value="Yerberas">Yerberas</option>
                <option value="Termos">Termos</option>
              </select>
            </div>
          </div>

          {/* Prices & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
                Precio ({config.currency}) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs font-bold bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
                Precio Tachado (Oferta)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Opcional"
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
                Etiqueta / Badge
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Ej: Más Vendido, 15% OFF"
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
              />
            </div>
          </div>

          {/* Image Selection with Presets */}
          <div>
            <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
              Fotografía del Mate
            </label>
            <p className="text-[11px] text-[#706757] mb-2.5">
              Elegí una de las fotos de alta calidad o pegá el enlace de tu foto:
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => setImage(preset.path)}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all ${
                    image === preset.path ? 'border-[#12231A] ring-2 ring-[#C48F56]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={preset.title}
                >
                  <img src={preset.path} alt={preset.title} className="w-full h-full object-cover" />
                  {image === preset.path && (
                    <div className="absolute top-1 right-1 bg-[#12231A] text-[#C48F56] rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="O ingresá la URL directa de la foto..."
                className="flex-1 text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
              />
              <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-xs font-semibold rounded-xl cursor-pointer border border-[#D5C9B5] shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#C48F56]" />
                <span>Subir foto</span>
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
                          setImage(ev.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
              Descripción del Mate
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explicá las bondades, el tipo de cuero, costura de tiento y la experiencia..."
              className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-[#12231A]"
            />
          </div>

          {/* Bullet Features */}
          <div>
            <label className="block text-xs font-semibold text-[#12231A] uppercase tracking-wider mb-1.5">
              Puntos Destacados
            </label>
            <div className="space-y-2 mb-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E3DBD0] text-xs">
                  <span className="flex-1 text-[#2D2821]">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-stone-400 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Agregar punto (ej: Costura reforzada en tiento vacuno)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 text-xs bg-white border border-[#D5C9B5] rounded-xl p-2 text-stone-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-xs font-bold rounded-xl"
              >
                Sumar
              </button>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#706757] mb-1">Cuerpo / Cuero</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-lg p-2 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#706757] mb-1">Virola</label>
              <input
                type="text"
                value={virola}
                onChange={(e) => setVirola(e.target.value)}
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-lg p-2 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#706757] mb-1">Capacidad</label>
              <input
                type="text"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-lg p-2 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#706757] mb-1">Origen Taller</label>
              <input
                type="text"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                className="w-full text-xs bg-white border border-[#D5C9B5] rounded-lg p-2 text-stone-800"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#2D2821]">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-[#12231A] focus:ring-[#12231A]"
              />
              <span className="font-semibold">Destacar en los primeros lugares de la tienda</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-5 border-t border-[#E3DBD0] flex justify-end gap-3">
            <button
              type="button"
              onClick={closeEditProductModal}
              className="px-5 py-2.5 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-xs font-bold rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-bold rounded-xl shadow-sm"
            >
              {isNew ? 'Guardar y Publicar' : 'Actualizar Producto'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
