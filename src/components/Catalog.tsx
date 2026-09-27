import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import { Search, Filter, X, Flame, ChevronDown } from 'lucide-react';

interface CatalogProps {
  onSelectProduct: (product: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [offersOnly, setOffersOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('*, variants:product_variants(*), images:product_images(*)')
        .order('created_at', { ascending: false });

      if (productsData) {
        // Sort: in stock first, then preorder
        const sorted = [...productsData].sort((a, b) => {
          if (a.is_preorder === b.is_preorder) return 0;
          return a.is_preorder ? 1 : -1;
        });
        setProducts(sorted);
      }
    } catch (e) {
      console.log('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  // Get unique teams
  const teams = [...new Set(products.map(p => p.team).filter(Boolean))];

  // Get all sizes
  const allSizes = [...new Set(products.flatMap(p => p.variants?.flatMap(v => v.sizes) || []))];

  // Filter products
  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.team.toLowerCase().includes(search.toLowerCase()) &&
        !p.variants?.some(v => v.player_name.toLowerCase().includes(search.toLowerCase()))) return false;
    if (teamFilter && p.team !== teamFilter) return false;
    if (sizeFilter && !p.variants?.some(v => v.sizes.includes(sizeFilter))) return false;
    if (stockFilter === 'stock' && p.is_preorder) return false;
    if (stockFilter === 'preorder' && !p.is_preorder) return false;
    if (offersOnly && (!p.original_price || p.original_price <= p.price)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedProducts = filtered.slice(0, page * perPage);

  const clearFilters = () => {
    setSearch('');
    setTeamFilter('');
    setSizeFilter('');
    setStockFilter('');
    setOffersOnly(false);
    setPage(1);
  };

  const hasActiveFilters = search || teamFilter || sizeFilter || stockFilter || offersOnly;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-8 bg-gray-100 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Search & Filter bar */}
      <div className="mb-4 sm:mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar..."
              className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm bg-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all flex items-center gap-1.5 text-sm font-medium active:scale-95 ${
              showFilters || hasActiveFilters
                ? 'bg-coral-50 border-coral-200 text-coral-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-coral-200'
            }`}
          >
            <Filter size={15} />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 bg-coral-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 animate-fade-in space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Equipo</label>
                <select
                  value={teamFilter}
                  onChange={e => { setTeamFilter(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value="">Todos</option>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Talla</label>
                <select
                  value={sizeFilter}
                  onChange={e => { setSizeFilter(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value="">Todas</option>
                  {allSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Disponibilidad</label>
                <select
                  value={stockFilter}
                  onChange={e => { setStockFilter(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value="">Todos</option>
                  <option value="stock">En stock</option>
                  <option value="preorder">Por encargo</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => { setOffersOnly(!offersOnly); setPage(1); }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  offersOnly
                    ? 'bg-coral-100 text-coral-700 border border-coral-200'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-coral-200'
                }`}
              >
                <Flame size={14} />
                Solo ofertas
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs sm:text-sm text-coral-600 hover:underline">
                  <X size={13} /> Limpiar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <p className="text-gray-500 text-base sm:text-lg">No se encontraron productos</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Intenta con otros filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
          ))}
        </div>
      )}

      {/* Load more */}
      {page < totalPages && (
        <div className="text-center mt-6 sm:mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm sm:text-base font-medium hover:border-coral-300 hover:bg-coral-50 transition-all flex items-center gap-2 mx-auto active:scale-95"
          >
            Cargar más <ChevronDown size={15} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Catalog;
