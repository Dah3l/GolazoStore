import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product, ProductVariant, DeliveryArea, BusinessSettings } from '../types';
import { Plus, Edit2, Trash2, LogOut, Package, Truck, Settings, Search, Upload, X, Save, MapPin } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'delivery' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>({
    business_name: '', whatsapp_number: '', email: '', address: '', description: '', instagram: '', facebook: '', telegram: ''
  });
  const [searchProduct, setSearchProduct] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [editingArea, setEditingArea] = useState<DeliveryArea | null>(null);
  const [loading, setLoading] = useState(true);

  // Product form
  const [pForm, setPForm] = useState({
    name: '', team: '', price: '', original_price: '', image_url: '', is_preorder: false, delivery_days: ''
  });
  const [pVariants, setPVariants] = useState<{player_name: string; sizes: string[]; stock: number}[]>([]);
  const [newVariant, setNewVariant] = useState({ player_name: '', selectedSizes: [] as string[], stock: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productImages, setProductImages] = useState<{url: string; uploading?: boolean}[]>([]);
  
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  // Area form
  const [aForm, setAForm] = useState({ nombre: '' });
  const [newPlace, setNewPlace] = useState({ nombre: '', precio: '' });

  useEffect(() => {
    checkAuth();
    loadAll();
  }, []);

  useEffect(() => {
    if (showProductModal || showAreaModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showProductModal, showAreaModal]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/admin/login');
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadAreas(), loadSettings()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, variants:product_variants(*), images:product_images(*)')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const loadAreas = async () => {
    const { data } = await supabase
      .from('delivery_areas')
      .select(`
        id,
        nombre,
        lugares:delivery_places(id, nombre, precio)
      `)
      .order('nombre');
    
    if (data) {
      setAreas(data.map(area => ({
        id: area.id,
        nombre: area.nombre,
        lugares: (area.lugares as any[]).map(lugar => ({
          nombre: lugar.nombre,
          precio: lugar.precio
        }))
      })));
    }
  };

  const loadSettings = async () => {
    const { data } = await supabase.from('business_settings').select('*').single();
    if (data) setSettings(data);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // ========== PRODUCT CRUD ==========
  const openNewProduct = () => {
    setEditingProduct(null);
    setPForm({ name: '', team: '', price: '', original_price: '', image_url: '', is_preorder: false, delivery_days: '' });
    setPVariants([]);
    setProductImages([]);
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
    const images = p.images?.sort((a, b) => a.display_order - b.display_order).map(img => ({ url: img.image_url })) || [];
    if (images.length === 0 && p.image_url) {
      images.push({ url: p.image_url });
    }
    setProductImages(images);
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    if (!pForm.name || !pForm.price) return;
    if (saving) return;
    
    setSaving(true);
    
    try {
      const mainImageUrl = productImages.length > 0 ? productImages[0].url : pForm.image_url;
      
      const productData = {
        name: pForm.name,
        team: pForm.team,
        price: Number(pForm.price),
        original_price: pForm.original_price ? Number(pForm.original_price) : null,
        image_url: mainImageUrl,
        is_preorder: pForm.is_preorder,
        delivery_days: pForm.delivery_days ? Number(pForm.delivery_days) : null,
      };

      let productId: string;
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) { alert('Error: ' + error.message); setSaving(false); return; }
        productId = editingProduct.id;
        await supabase.from('product_variants').delete().eq('product_id', productId);
        await supabase.from('product_images').delete().eq('product_id', productId);
      } else {
        const { data, error } = await supabase.from('products').insert(productData).select().single();
        if (error) { alert('Error: ' + error.message); setSaving(false); return; }
        productId = data.id;
      }

      if (!pForm.is_preorder) {
        for (const v of pVariants) {
          await supabase.from('product_variants').insert({
            product_id: productId,
            player_name: v.player_name,
            sizes: v.sizes,
            stock: v.stock,
          });
        }
      }
      
      for (let i = 0; i < productImages.length; i++) {
        await supabase.from('product_images').insert({
          product_id: productId,
          image_url: productImages[i].url,
          display_order: i,
        });
      }

      setShowProductModal(false);
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error inesperado al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    const product = products.find(p => p.id === id);
    if (product && product.images) {
      const fileNames = product.images
        .map(img => {
          const urlParts = img.image_url.split('/');
          return urlParts[urlParts.length - 1];
        })
        .filter(Boolean);
      
      if (fileNames.length > 0) {
        try {
          await supabase.storage.from('products').remove(fileNames);
        } catch (err) {
          console.error('Error eliminando imágenes del storage:', err);
        }
      }
    }
    
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('product_variants').delete().eq('product_id', id);
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const addVariant = () => {
    if (!newVariant.player_name || newVariant.selectedSizes.length === 0) return;
    setPVariants([...pVariants, {
      player_name: newVariant.player_name,
      sizes: newVariant.selectedSizes,
      stock: Number(newVariant.stock) || 0,
    }]);
    setNewVariant({ player_name: '', selectedSizes: [], stock: '' });
  };
  
  const toggleSize = (size: string) => {
    setNewVariant(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const removeVariant = (idx: number) => {
    setPVariants(pVariants.filter((_, i) => i !== idx));
  };

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const newImages: {url: string; uploading?: boolean}[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          alert(`El archivo ${file.name} no es una imagen válida`);
          continue;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          alert(`La imagen ${file.name} no debe superar los 5MB`);
          continue;
        }
        
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}_${i}.${ext}`;
        
        const { error } = await supabase.storage
          .from('products')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Error de subida:', error);
          alert(`Error subiendo ${file.name}: ${error.message}`);
          continue;
        }
        
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(path);
        newImages.push({ url: urlData.publicUrl });
      }
      
      setProductImages(prev => [...prev, ...newImages]);
      
      if (newImages.length > 0 && !pForm.image_url) {
        setPForm(prev => ({ ...prev, image_url: newImages[0].url }));
      }
      
      if (newImages.length > 0) {
        alert(`✅ ${newImages.length} imagen${newImages.length > 1 ? 'es' : ''} subida${newImages.length > 1 ? 's' : ''} correctamente`);
      }
    } catch (err: any) {
      console.error('Error inesperado:', err);
      alert('Error inesperado al subir las imágenes');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };
  
  const removeImage = async (index: number) => {
    const imageToRemove = productImages[index];
    
    if (imageToRemove && imageToRemove.url) {
      try {
        const urlParts = imageToRemove.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        if (fileName) {
          await supabase.storage.from('products').remove([fileName]);
        }
      } catch (err) {
        console.error('Error eliminando imagen del storage:', err);
      }
    }
    
    setProductImages(prev => prev.filter((_, i) => i !== index));
    
    if (index === 0 && productImages.length > 1) {
      setPForm(prev => ({ ...prev, image_url: productImages[1].url }));
    } else if (productImages.length === 1) {
      setPForm(prev => ({ ...prev, image_url: '' }));
    }
  };
  
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= productImages.length) return;
    const newImages = [...productImages];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setProductImages(newImages);
    if (toIndex === 0 || fromIndex === 0) {
      setPForm(prev => ({ ...prev, image_url: newImages[0].url }));
    }
  };

  // ========== DELIVERY AREAS CRUD ==========
  const openNewArea = () => {
    setEditingArea(null);
    setAForm({ nombre: '' });
    setShowAreaModal(true);
  };

  const openEditArea = (area: DeliveryArea) => {
    setEditingArea(area);
    setAForm({ nombre: area.nombre });
    setShowAreaModal(true);
  };

  const saveArea = async () => {
    if (!aForm.nombre) return;
    
    try {
      if (editingArea) {
        const { error } = await supabase
          .from('delivery_areas')
          .update({ nombre: aForm.nombre })
          .eq('id', editingArea.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('delivery_areas')
          .insert({ nombre: aForm.nombre });
        
        if (error) throw error;
      }
      
      setShowAreaModal(false);
      await loadAreas();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const deleteArea = async (id: string) => {
    if (!confirm('¿Eliminar esta localidad y todos sus puntos de entrega?')) return;
    
    try {
      await supabase.from('delivery_places').delete().eq('area_id', id);
      await supabase.from('delivery_areas').delete().eq('id', id);
      await loadAreas();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const addPlace = async (areaId: string) => {
    if (!newPlace.nombre || !newPlace.precio) return;
    
    try {
      const { error } = await supabase
        .from('delivery_places')
        .insert({
          area_id: areaId,
          nombre: newPlace.nombre,
          precio: Number(newPlace.precio)
        });
      
      if (error) throw error;
      
      setNewPlace({ nombre: '', precio: '' });
      await loadAreas();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const deletePlace = async (areaId: string, placeName: string) => {
    if (!confirm(`¿Eliminar el punto de entrega "${placeName}"?`)) return;
    
    try {
      await supabase
        .from('delivery_places')
        .delete()
        .eq('area_id', areaId)
        .eq('nombre', placeName);
      
      await loadAreas();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  // ========== SETTINGS ==========
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
            <img 
              src="https://yyfpiyjwtrrvrsbmtgog.supabase.co/storage/v1/object/public/products/Logo/SAVE_20260927_150213.jpg" 
              alt="Golazo Store" 
              className="w-8 h-8 rounded-lg object-cover"
            />
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
            { id: 'delivery' as const, icon: Truck, label: 'Entregas' },
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

        {/* Delivery Tab */}
        {activeTab === 'delivery' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy-900 text-lg">Localidades y Puntos de Entrega</h2>
              <button onClick={openNewArea} className="flex items-center gap-2 px-4 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-sm font-medium transition-colors">
                <Plus size={16} /> Nueva Localidad
              </button>
            </div>

            <div className="space-y-4">
              {areas.map(area => (
                <div key={area.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Area Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-coral-500" />
                      <h3 className="font-semibold text-navy-900">{area.nombre}</h3>
                      <span className="text-xs text-gray-500">({area.lugares.length} puntos)</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditArea(area)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => deleteArea(area.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Places List */}
                  <div className="p-4">
                    {area.lugares.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {area.lugares.map((lugar, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div>
                              <span className="text-sm font-medium text-navy-900">{lugar.nombre}</span>
                              <span className="text-xs text-gray-500 ml-2">{lugar.precio} CUP</span>
                            </div>
                            <button 
                              onClick={() => deletePlace(area.id, lugar.nombre)}
                              className="p-1 rounded hover:bg-red-50 text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No hay puntos de entrega</p>
                    )}

                    {/* Add Place Form */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-600 mb-2">Agregar punto de entrega:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPlace.nombre}
                          onChange={e => setNewPlace({...newPlace, nombre: e.target.value})}
                          placeholder="Nombre del lugar"
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <input
                          type="number"
                          value={newPlace.precio}
                          onChange={e => setNewPlace({...newPlace, precio: e.target.value})}
                          placeholder="Precio CUP"
                          className="w-28 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <button
                          onClick={() => addPlace(area.id)}
                          disabled={!newPlace.nombre || !newPlace.precio}
                          className="px-4 py-2 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {areas.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                  No hay localidades configuradas
                </div>
              )}
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
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-navy-900 text-lg">{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
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

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  Imágenes del Producto
                  <span className="text-xs font-normal text-gray-500 ml-auto">{productImages.length} imagen{productImages.length !== 1 ? 'es' : ''}</span>
                </h4>
                
                <label className={`w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-center gap-2 border-2 border-dashed ${
                  uploading ? 'bg-gray-100 text-gray-500 border-gray-300' : 'bg-coral-50 text-coral-600 border-coral-200 hover:bg-coral-100'
                }`}>
                  <Upload size={16} /> 
                  {uploading ? 'Subiendo imágenes...' : '📷 Subir imágenes (puedes seleccionar varias)'}
                  <input type="file" accept="image/*" multiple onChange={uploadImages} className="hidden" disabled={uploading} />
                </label>
                
                {productImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">💡 La primera imagen será la principal. Usa las flechas para reordenar.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {productImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img.url} alt={`Imagen ${index + 1}`} className="w-full h-28 sm:h-32 rounded-xl object-cover border-2 border-gray-200" />
                          {index === 0 && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-coral-500 text-white text-[10px] font-bold rounded-md">
                              Principal
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                            {index > 0 && (
                              <button
                                onClick={() => moveImage(index, index - 1)}
                                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                              >
                                ←
                              </button>
                            )}
                            {index < productImages.length - 1 && (
                              <button
                                onClick={() => moveImage(index, index + 1)}
                                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                              >
                                →
                              </button>
                            )}
                            <button
                              onClick={() => removeImage(index)}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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

              {!pForm.is_preorder ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    Variantes (Jugadores)
                    <span className="text-xs font-normal text-gray-500 ml-auto">{pVariants.length} agregada{pVariants.length !== 1 ? 's' : ''}</span>
                  </h4>

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

                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 space-y-3">
                    <p className="text-xs font-medium text-gray-600">Agregar nueva variante:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        <label className="text-xs text-gray-500 mb-1 block">Stock disponible *</label>
                        <input 
                          type="number" 
                          value={newVariant.stock} 
                          onChange={e => setNewVariant({...newVariant, stock: e.target.value})}
                          onKeyDown={e => e.key === 'Enter' && addVariant()}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-coral-400 outline-none" 
                          placeholder="10" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Tallas disponibles * (selecciona una o más)</label>
                      <div className="flex flex-wrap gap-2">
                        {availableSizes.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                              newVariant.selectedSizes.includes(size)
                                ? 'bg-coral-500 text-white border-coral-500 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-coral-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {newVariant.selectedSizes.length > 0 && (
                        <p className="text-xs text-coral-600 mt-2">
                          ✓ {newVariant.selectedSizes.length} talla{newVariant.selectedSizes.length > 1 ? 's' : ''} seleccionada{newVariant.selectedSizes.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      onClick={addVariant}
                      disabled={!newVariant.player_name || newVariant.selectedSizes.length === 0 || !newVariant.stock}
                      className="w-full py-2.5 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      + Agregar Variante
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">🕐</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Producto por encargo</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Las variantes (jugadores/tallas/stock) no están disponibles para productos por encargo. 
                        Los clientes podrán seleccionar talla al hacer el pedido.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={saveProduct}
                disabled={!pForm.name || !pForm.price || saving}
                className="w-full py-3.5 bg-coral-500 hover:bg-coral-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-coral-500/30 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} /> {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area Modal */}
      {showAreaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowAreaModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900">{editingArea ? 'Editar' : 'Nueva'} Localidad</h3>
              <button onClick={() => setShowAreaModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre de la localidad</label>
                <input value={aForm.nombre} onChange={e => setAForm({nombre: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none" 
                  placeholder="Ej: Playa, Vedado, etc." />
              </div>
              <button onClick={saveArea}
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
