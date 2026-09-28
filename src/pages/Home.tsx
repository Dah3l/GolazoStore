import React, { useState } from 'react';
import { Product } from '../types';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import ProductModal from '../components/ProductModal';
import Cart from '../components/Cart';
import OrderForm from '../components/OrderForm';
import InfoSection from '../components/InfoSection';
import Footer from '../components/Footer';
import Onboarding from '../components/Onboarding';
import ConnectionHelp from '../components/ConnectionHelp';

const Home: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCheckout = () => {
    setCartOpen(false);
    setOrderOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <Catalog onSelectProduct={setSelectedProduct} />
      <InfoSection />
      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
      <OrderForm isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
      <Onboarding />
      <ConnectionHelp />
    </div>
  );
};

export default Home;
