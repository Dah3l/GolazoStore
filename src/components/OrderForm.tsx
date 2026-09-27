import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useBusiness } from '../context/BusinessContext';
import { DeliveryZone } from '../types';
import { supabase } from '../lib/supabase';
import { X, MapPin, User, Phone, Clock, MessageSquare, Copy, Check } from 'lucide-react';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, clearCart } = useCart();
  const { settings } = useBusiness();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    zone: '',
    address: '',
    pickupTime: '',
    notes: '',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const { data } = await supabase.from('delivery_zones').select('*').order('name');
      if (data) setZones(data);
    } catch (e) {
      console.log('No zones loaded');
    }
  };

  const selectedZone = zones.find(z => z.id === form.zone);
  const deliveryPrice = selectedZone?.price || 0;

  const buildMessage = () => {
    let msg = `🛒 *NUEVO PEDIDO*\n\n`;
    msg += `👤 *Cliente:* ${form.name}\n`;
    msg += `📱 *Teléfono:* ${form.phone}\n\n`;
    msg += `📦 *Productos:*\n`;
    msg += `━━━━━━━━━━━━━━━\n`;
    items.forEach((item, i) => {
      msg += `${i + 1}. ${item.product.name}\n`;
      msg += `   👕 Jugador: ${item.variant.player_name}\n`;
      msg += `   📏 Talla: ${item.size}\n`;
      msg += `   🔢 Cantidad: ${item.quantity}\n`;
      msg += `   💰 Precio: $${item.product.price * item.quantity} USD\n\n`;
    });
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `💵 *Subtotal:* $${totalPrice} USD\n`;
    if (deliveryPrice > 0) {
      msg += `🚚 *Envío (${selectedZone?.name}):* ${deliveryPrice} CUP\n`;
    }
    if (form.address) msg += `📍 *Dirección:* ${form.address}\n`;
    if (form.pickupTime) msg += `🕐 *Hora de retiro:* ${form.pickupTime}\n`;
    if (form.notes) msg += `📝 *Notas:* ${form.notes}\n`;
    msg += `\n✅ ¡Gracias por tu compra!`;
    return msg;
  };

  const sendWhatsApp = () => {
    const message = buildMessage();
    let phone = settings.whatsapp_number.replace(/\s/g, '');
    if (!phone.startsWith('+')) phone = '+' + phone;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    } else {
      window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    }

    clearCart();
    onClose();
  };

  const copyMessage = async () => {
    const message = buildMessage();
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[95vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="font-bold text-navy-900 text-base sm:text-lg">Finalizar Pedido</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-3 sm:space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-1.5">
              <User size={15} className="text-coral-500" /> Nombre completo
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm"
              placeholder="Tu nombre"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-1.5">
              <Phone size={15} className="text-coral-500" /> Teléfono
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm"
              placeholder="+53 5XXXXXXX"
            />
          </div>

          {/* Zone */}
          {zones.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-1.5">
                <MapPin size={15} className="text-coral-500" /> Zona de entrega
              </label>
              <select
                value={form.zone}
                onChange={e => setForm({ ...form, zone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm bg-white"
              >
                <option value="">Seleccionar zona...</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - {zone.price} CUP
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Address */}
          {form.zone && (
            <div className="animate-fade-in">
              <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-1.5">
                <MapPin size={15} className="text-coral-500" /> Dirección de entrega
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm"
                placeholder="Calle, número, entre calles..."
              />
            </div>
          )}

          {/* Pickup time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-1.5">
              <Clock size={15} className="text-coral-500" /> Hora de retiro (si aplica)
            </label>
            <input
              type="text"
              value={form.pickupTime}
              onChange={e => setForm({ ...form, pickupTime: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm"
              placeholder="Ej: Después de las 5pm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-900 mb-1.5">
              <MessageSquare size={15} className="text-coral-500" /> Notas adicionales
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-400 focus:ring-2 focus:ring-coral-100 outline-none transition-all text-sm resize-none"
              placeholder="Alguna indicación especial..."
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Productos ({items.length}):</span>
              <span className="font-medium">${totalPrice} USD</span>
            </div>
            {deliveryPrice > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Envío:</span>
                <span className="font-medium">{deliveryPrice} CUP</span>
              </div>
            )}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
              <span className="font-bold text-navy-900">Total:</span>
              <span className="font-bold text-coral-600 text-lg">${totalPrice} USD</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={sendWhatsApp}
              disabled={!form.name || !form.phone}
              className="w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all shadow-lg shadow-green-500/30 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <span>Enviar pedido por WhatsApp</span>
              <span className="text-lg">💬</span>
            </button>
            <button
              onClick={copyMessage}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              {copied ? '¡Copiado!' : 'Copiar mensaje'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
