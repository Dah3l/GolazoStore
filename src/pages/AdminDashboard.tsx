import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant, DeliveryZone, BusinessSettings } from '../types';
import { Plus, Edit2, Trash2, LogOut, Package, Truck, Settings, Search, Upload, X, Save, ChevronDown } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'zones' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>({
    business_name: '', whatsapp_number: '', email: '', address: '', description: '', instagram: '', facebook: '', telegram: ''
  });
  const [searchProduct, setSearchProduct] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [loading, setLoading] = useState(true);

  // Product form
  const [pForm, setPForm] = useState({
    name: '', team: '', price: '', original_price: '', image_url: '', is_preorder: false, delivery_days: ''
  });
  const [pVariants, setPVariants] = useState<{player_name: string; sizes: string[]; stock: number}[]>([]);
  const [newVariant, setNewVariant] = useState({ player_name: '', sizes: '', stock: '' });
  const [uploading, setUploading] = useState(false);

  // Zone form
  const [zForm, setZForm] = useState({ name: '', price: '' });

  useEffect(() => {
    checkAuth();
    loadAll();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/admin/login');
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadZones(), loadSettings()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*, variants:product_variants(*)').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const loadZones = async () => {
    const { data } = await supabase.from('delivery_zones').select('*').order('name');
    if (data) setZones(data);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from('business_settings').select('*').single();
    if (data) setSettings(data);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Product CRUD
  const openNewProduct = () => {
    setEditingProduct(null);
    setPForm({ name: '', team: '', price: '', original_price: '', image_url: '', is_preorder: false, delivery_days: '' });
    setPVariants([]);
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPForm({
      name: p.name, team: p.team, price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : '',
      image_url: p.image_url, is_preorder: p.is_preorder,
      delivery_days: p.delivery_days ? String(p.delivery_days) : ''
    });
    setPVariants(p.variants?.map(v => ({ player_name: v.player_name, sizes: v.sizes, stock: v.stock })) || []);
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    if (!pForm.name || !pForm.price) return;
    const productData = {
      name: pForm.name,
      team: pForm.team,
      price: Number(pForm.price),
      original_price: pForm.original_price ? Number(pForm.original_price) : null,
      image_url: pForm.image_url,
      is_preorder: pForm.is_preorder,
      delivery_days: pForm.delivery_days ? Number(pForm.delivery_days) : null,
    };

    let productId: string;
    if (editingProduct) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
      if (error) { alert('Error: ' + error.message); return; }
      productId = editingProduct.id;
      await supabase.from('product_variants').delete().eq('product_id', productId);
    } else {
      const { data, error } = await supabase.from('products').insert(productData).select().single();
      if (error) { alert('Error: ' + error.message); return; }
      productId = data.id;
    }

    // Save variants
    for (const v of pVariants) {
      await supabase.from('product_variants').insert({
        product_id: productId,
        player_name: v.player_name,
        sizes: v.sizes,
        stock: v.stock,
      });
    }

    setShowProductModal(false);
    loadProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await supabase.from('product_variants').delete().eq('product_id', id);
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const addVariant = () => {
    if (!newVariant.player_name) return;
    setPVariants([...pVariants, {
      player_name: newVariant.player_name,
      sizes: newVariant.sizes.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(newVariant.stock) || 0,
    }]);
    setNewVariant({ player_name: '', sizes: '', stock: '' });
  };

  const removeVariant = (idx: number) => {
    setPVariants(pVariants.filter((_, i) => i !== idx));
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }
    
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error de subida:', error);
        alert(`Error subiendo imagen: ${error.message}\n\nVerifica que:\n1. El bucket 'products' existe\n2. El bucket es público\n3. Ejecutaste supabase-storage-policies.sql`);
        setUploading(false);
        return;
      }
      
      const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
      setPForm({ ...pForm, image_url: urlData.publicUrl });
      alert('✅ Imagen subida correctamente');
    } catch (err: any) {
      console.error('Error inesperado:', err);
      alert('Error inesperado al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  // Zone CRUD
  const openNewZone = () => {
    setEditingZone(null);
    setZForm({ name: '', price: '' });
    setShowZoneModal(true);
  };

  const openEditZone = (z: DeliveryZone) => {
    setEditingZone(z);
    setZForm({ name: z.name, price: String(z.price) });
    setShowZoneModal(true);
  };

  const saveZone = async () => {
    if (!zForm.name || !zForm.price) return;
    if (editingZone) {
      await supabase.from('delivery_zones').update({ name: zForm.name, price: Number(zForm.price) }).eq('id', editingZone.id);
    } else {
      await supabase.from('delivery_zones').insert({ name: zForm.name, price: Number(zForm.price) });
    }
    setShowZoneModal(false);
    loadZones();
  };

  const deleteZone = async (id: string) => {
    if (!confirm('¿Eliminar esta zona?')) return;
    await supabase.from('delivery_zones').delete().eq('id', id);
    loadZones();
  };

  // Save settings
  const saveSettings = async () => {
    const { error } = await supabase.from('business_settings').upsert({ id: settings.id || 'main', ...settings });
    if (error) { alert('Error: ' + error.message); return; }
    alert('✅ Configuración guardada');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.team.toLowerCase().includes(searchProduct.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-coral-200 border-t-coral-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-coral-500 to-coral-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SW</span>
            </div>
            <span className="font-bold text-navy-900 hidden sm:block">Admin Panel</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 w-fit">
          {[
            { id: 'products' as const, icon: Package, label: 'Productos' },
            { id: 'zones' as const, icon: Truck, label: 'Envíos' },
            { id: 'settings' as const, icon: Settings, label: 'Config' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-coral-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1 w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={e => setSearchProduct(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                />
              </div>
              <button onClick={openNewProduct} className="flex items-center gap-2 px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                <Plus size={16} /> Nuevo Producto
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Equipo</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Precio</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Tipo</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-medium text-navy-900 truncate max-w-[150px]">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.team}</td>
                        <td className="px-4 py-3">
                          {p.original_price && p.original_price > p.price ? (
                            <div>
                              <span className="font-bold text-coral-600">${p.price}</span>
                              <span className="text-gray-400 line-through text-xs ml-1">${p.original_price}</span>
                            </div>
                          ) : (
                            <span className="font-medium">${p.price}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${p.is_preorder ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {p.is_preorder ? 'Encargo' : 'Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditProduct(p)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                              <Edit2 size={15} />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">No hay productos</div>
              )}
            </div>
          </div>
        )}

        {/* Zones Tab */}
        {activeTab === 'zones' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 text-lg">Zonas de Entrega</h2>
              <button onClick={openNewZone} className="flex items-center gap-2 px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-sm font-medium transition-colors">
                <Plus size={16} /> Nueva Zona
              </button>
            </div>
            <div className="grid gap-3">
              {zones.map(z => (
                <div key={z.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy-900">{z.name}</p>
                    <p className="text-sm text-gray-500">{z.price} CUP</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditZone(z)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => deleteZone(z.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {zones.length === 0 && <p className="text-center py-8 text-gray-500">No hay zonas configuradas</p>}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-lg">
            <h2 className="font-bold text-navy-900 text-lg mb-4">Configuración del Negocio</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              {[
                { key: 'business_name', label: 'Nombre del negocio', type: 'text' },
                { key: 'whatsapp_number', label: 'WhatsApp (sin + ni espacios)', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'address', label: 'Dirección', type: 'text' },
                { key: 'instagram', label: 'Instagram URL', type: 'text' },
                { key: 'facebook', label: 'Facebook URL', type: 'text' },
                { key: 'telegram', label: 'Telegram URL', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={(settings as any)[field.key] || ''}
                    onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</label>
                <textarea
                  value={settings.description}
                  onChange={e => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none resize-none"
                />
              </div>
              <button
                onClick={saveSettings}
                className="w-full py-3 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} /> Guardar Configuración
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-y-auto" onClick={() => setShowProductModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[95vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-navy-900 text-lg">{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Basic Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  Información Básica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Nombre del producto *</label>
                    <input value={pForm.name} onChange={e => setPForm({...pForm, name: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none" 
                      placeholder="Camiseta Local Real Madrid 2024" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Equipo</label>
                    <input value={pForm.team} onChange={e => setPForm({...pForm, team: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none" 
                      placeholder="Real Madrid" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Precio (USD) *</label>
                    <input type="number" value={pForm.price} onChange={e => setPForm({...pForm, price: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none" 
                      placeholder="20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Precio Original (USD) <span className="text-gray-400">- solo si hay oferta</span></label>
                    <input type="number" value={pForm.original_price} onChange={e => setPForm({...pForm, original_price: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none" 
                      placeholder="25" />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Imagen del Producto
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input value={pForm.image_url} onChange={e => setPForm({...pForm, image_url: e.target.value})}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none" 
                    placeholder="URL de imagen o sube un archivo" />
                  <label className={`px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    uploading ? 'bg-gray-200 text-gray-500' : 'bg-coral-500 hover:bg-coral-600 text-white'
                  }`}>
                    <Upload size={16} /> {uploading ? 'Subiendo...' : 'Subir Imagen'}
                    <input type="file" accept="image/*" onChange={uploadImage} className="hidden" disabled={uploading} />
                  </label>
                </div>
                {pForm.image_url && (
                  <div className="relative inline-block">
                    <img src={pForm.image_url} alt="Preview" className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200" />
                    <button 
                      onClick={() => setPForm({...pForm, image_url: ''})}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">💡 Tip: Puedes pegar una URL o subir una imagen desde tu dispositivo (máx. 5MB)</p>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  Disponibilidad
                </h4>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input type="checkbox" checked={pForm.is_preorder} onChange={e => setPForm({...pForm, is_preorder: e.target.checked})}
                      className="w-5 h-5 accent-coral-500 rounded" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">Producto por encargo</span>
                      <span className="text-xs text-gray-500">Marca si es preventa o bajo pedido</span>
                    </div>
                  </label>
                  {pForm.is_preorder && (
                    <div className="flex items-center gap-2">
                      <input type="number" value={pForm.delivery_days} onChange={e => setPForm({...pForm, delivery_days: e.target.value})}
                        className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="7" />
                      <span className="text-xs text-gray-500">días</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  Variantes (Jugadores)
                  <span className="text-xs font-normal text-gray-500 ml-auto">{pVariants.length} agregada{pVariants.length !== 1 ? 's' : ''}</span>
                </h4>

                {/* Existing variants */}
                {pVariants.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {pVariants.map((v, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-coral-50 to-white rounded-xl border border-coral-100">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-navy-900 text-sm truncate">{v.player_name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-600">
                              <span className="font-medium">Tallas:</span> {v.sizes.join(', ')}
                            </span>
                            <span className="text-xs text-gray-600">
                              <span className="font-medium">Stock:</span> {v.stock}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeVariant(i)} 
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new variant */}
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 space-y-3">
                  <p className="text-xs font-medium text-gray-600">Agregar nueva variante:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Nombre del jugador *</label>
                      <input 
                        value={newVariant.player_name} 
                        onChange={e => setNewVariant({...newVariant, player_name: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && addVariant()}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-coral-400 outline-none" 
                        placeholder="Ej: Bellingham" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Tallas (separadas por coma)</label>
                      <input 
                        value={newVariant.sizes} 
                        onChange={e => setNewVariant({...newVariant, sizes: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && addVariant()}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-coral-400 outline-none" 
                        placeholder="S, M, L, XL" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Stock disponible</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={newVariant.stock} 
                          onChange={e => setNewVariant({...newVariant, stock: e.target.value})}
                          onKeyDown={e => e.key === 'Enter' && addVariant()}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-coral-400 outline-none" 
                          placeholder="10" />
                        <button 
                          onClick={addVariant}
                          disabled={!newVariant.player_name}
                          className="px-4 py-2 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">💡 Tip: Presiona Enter para agregar rápidamente</p>
                </div>
              </div>

              {/* Save button */}
              <button 
                onClick={saveProduct}
                disabled={!pForm.name || !pForm.price}
                className="w-full py-3.5 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-coral-500/30 flex items-center justify-center gap-2"
              >
                <Save size={18} /> {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowZoneModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900">{editingZone ? 'Editar' : 'Nueva'} Zona</h3>
              <button onClick={() => setShowZoneModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                <input value={zForm.name} onChange={e => setZForm({...zForm, name: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="La Habana" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Precio (CUP)</label>
                <input type="number" value={zForm.price} onChange={e => setZForm({...zForm, price: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="200" />
              </div>
              <button onClick={saveZone}
                className="w-full py-3 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                <Save size={16} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
