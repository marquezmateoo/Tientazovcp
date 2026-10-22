import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Settings, Edit3, X, HelpCircle, Smartphone, Tag, PlusCircle } from 'lucide-react';

export const AdminBarBanner: React.FC = () => {
  const { isAdminMode, setIsAdminMode, setIsSettingsDrawerOpen, openEditProductModal } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-900 text-amber-50 text-xs py-2 px-4 border-b border-amber-950 flex items-center justify-between gap-3 shadow-inner">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
        
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-800 text-amber-200">
            <Edit3 className="w-3.5 h-3.5" />
          </span>
          <p className="font-medium text-stone-100">
            <strong>¿Querés editar la tienda?</strong> Podés cambiar precios, fotos, agregar nuevos mates y poner tu WhatsApp sin tocar código.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAdminMode(true);
              setIsSettingsDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition-colors shadow-xs text-xs whitespace-nowrap"
          >
            <Settings className="w-3.5 h-3.5 text-amber-900" />
            <span>Abrir Panel de Control</span>
          </button>

          <button
            onClick={() => {
              setIsAdminMode(true);
              openEditProductModal(null);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-800/80 hover:bg-amber-800 text-amber-100 font-semibold rounded-lg border border-amber-700 transition-colors text-xs whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Agregar Mate</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-300 hover:text-white rounded"
            aria-label="Ocultar aviso"
            title="Ocultar barra de ayuda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
