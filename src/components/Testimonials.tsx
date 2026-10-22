import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, CheckCircle2, MessageSquarePlus } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { reviews, addReview } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [comment, setComment] = useState('');
  const [productName, setProductName] = useState('Mate Imperial Tientazo');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;
    addReview({
      author,
      city: city || 'Argentina',
      rating: 5,
      comment,
      productName,
    });
    setAuthor('');
    setCity('');
    setComment('');
    setShowAddModal(false);
  };

  return (
    <section id="opiniones" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E3DBD0]">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs font-semibold tracking-wider text-[#966336] uppercase mb-2">
            Ronda de Opiniones
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12231A] tracking-tight">
            La Experiencia de Quienes Ya Toman con TIENTAZO
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto border border-[#C48F56]/30 shadow-xs"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-[#C48F56]" />
          <span>Dejar tu Opinión</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-[#E3DBD0] shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-[#C48F56] mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C48F56]" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-xs sm:text-sm text-[#464036] leading-relaxed mb-4 italic">
                "{rev.comment}"
              </p>
            </div>

            {/* Author info */}
            <div className="pt-4 border-t border-[#ECE7DD] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#12231A] flex items-center gap-1">
                  {rev.author}
                  <span title="Comprador verificado">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  </span>
                </h4>
                <p className="text-[11px] text-[#7A7162]">
                  {rev.city} · <span className="text-[#966336] font-medium">{rev.productName}</span>
                </p>
              </div>
              <span className="text-[10px] text-[#8C8374]">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#FAF8F3] rounded-3xl shadow-xl p-6 border border-[#D5C9B5]">
            <h3 className="font-serif text-lg font-bold text-[#12231A] mb-1">
              Compartí tu Experiencia con TIENTAZO
            </h3>
            <p className="text-xs text-[#5F574A] mb-4">
              Tu reseña apoya a nuestro nuevo taller en Carlos Paz y guía a otros materos.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Tu Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Marcos Silva"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Ciudad / Provincia</label>
                <input
                  type="text"
                  placeholder="Ej: Villa Carlos Paz / Rosario / CABA"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Modelo que compraste</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2821] mb-1">Tu Comentario *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contanos sobre el tiento, el cuero o la rapidez del envío..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-xs bg-white border border-[#D5C9B5] rounded-xl p-2.5 text-stone-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-[#EFE9DE] hover:bg-[#E2DACB] text-[#12231A] text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#12231A] hover:bg-[#1E392A] text-white text-xs font-semibold rounded-xl"
                >
                  Publicar Reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
