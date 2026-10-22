import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Edit2, Check, MapPin } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { config, updateConfig, isAdminMode } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(config.announcement);

  const handleSave = () => {
    updateConfig({ announcement: text });
    setIsEditing(false);
  };

  return (
    <aside aria-label="Anuncio promocional" className="bg-[#12231A] text-[#E8DFD1] text-xs py-2 px-4 transition-colors border-b border-[#0D1A13]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Subtle location indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#C48F56] shrink-0 font-medium">
          <MapPin className="w-3 h-3 text-[#C48F56]" />
          <span>{config.location}</span>
        </div>

        {/* Center announcement */}
        <div className="flex-1 text-center font-medium tracking-wide">
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-[#1C3527] text-white text-xs px-2.5 py-1 rounded border border-[#C48F56]/40 w-full focus:outline-none focus:border-[#C48F56]"
                placeholder="Texto del anuncio superior..."
              />
              <button
                onClick={handleSave}
                className="bg-[#C48F56] hover:bg-[#A8743E] text-stone-950 font-bold px-2.5 py-1 rounded text-xs flex items-center gap-1 shrink-0"
              >
                <Check className="w-3 h-3" />
                Guardar
              </button>
            </div>
          ) : (
            <p className="truncate">
              {config.announcement}
            </p>
          )}
        </div>

        {/* Admin edit button */}
        {isAdminMode && !isEditing ? (
          <button
            onClick={() => {
              setText(config.announcement);
              setIsEditing(true);
            }}
            className="text-[#E2AE76] hover:text-[#FFCF9B] text-[11px] flex items-center gap-1 shrink-0 bg-[#1C3527] px-2 py-0.5 rounded border border-[#C48F56]/40"
            title="Editar texto del anuncio"
          >
            <Edit2 className="w-3 h-3" />
            <span>Editar anuncio</span>
          </button>
        ) : (
          <div className="hidden lg:block text-[11px] text-[#A69E8F] shrink-0">
            Raíz criolla · Espíritu de hoy
          </div>
        )}
      </div>
    </aside>
  );
};
