import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Tag, X, CheckCircle2, Image as ImageIcon, Search, Filter, CreditCard, ShoppingCart, Minus, Upload, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { MarketplaceService, MarketplaceItem } from '../../services/MarketplaceService';
import MockPaymentGateway from '../../payment/MockPaymentGateway';

// Use the interface from service, but mapped for local usage if needed, or just use the service type directly if compatible
// We will adapt the local Product interface to match
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  isGradient: boolean;
  quantity?: string;
  sellerId?: string;
}

interface MaterialExchangeProps {
  showToast: (type: 'success' | 'error', msg: string) => void;
  addToCart: (product: Product, quantity: number) => void;
}

const MaterialExchange: React.FC<MaterialExchangeProps> = ({ showToast, addToCart }) => {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isDragActive, setIsDragActive] = useState(false);

  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Sell Form State
  const [sellForm, setSellForm] = useState({
    title: '',
    price: '',
    category: 'Plastic',
    description: '',
    imageUrl: '',
    quantity: '1 Lot',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const items = await MarketplaceService.getItems();
      setProducts(items);
    } catch (error) {
      console.error("Failed to load items", error);
      // showToast('error', 'Failed to load marketplace items');
    } finally {
      setLoading(false);
    }
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.title || !sellForm.price || !sellForm.description) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await MarketplaceService.createItem({
        title: sellForm.title,
        price: parseFloat(sellForm.price),
        category: sellForm.category,
        description: sellForm.description,
        quantity: sellForm.quantity,
        location: sellForm.location,
        image: sellForm.imageUrl
      });

      showToast('success', 'Item listed successfully!');

      // Reset and switch mode
      setSellForm({ title: '', price: '', category: 'Plastic', description: '', imageUrl: '', quantity: '1 Lot', location: '' });
      setMode('buy');
      loadItems(); // Refresh list

    } catch (error: any) {
      console.error("Listing failed", error);
      showToast('error', error.message || 'Failed to list item. Ensure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload a valid image file (JPG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSellForm(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
      showToast('success', `${quantity} item${quantity > 1 ? 's' : ''} added to cart!`);
      setSelectedProduct(null);
    }
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      setPaymentAmount(selectedProduct.price * quantity);
      setShowPaymentModal(true);
      // We keep selectedProduct set so we know what is being bought
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    showToast('success', 'Payment successful! Order processed.');

    // Ideally update stock in DB here (Service.updateItem...)
    // For now just close modal
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in-up space-y-6 max-w-7xl mx-auto">

      {/* Mock Payment Modal */}
      <MockPaymentGateway
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
      />

      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Material Exchange</h2>
            <p className="text-gray-500 text-sm">Buy and sell recyclable materials directly.</p>
          </div>
        </div>

        {/* Animated Toggle Switch */}
        <div className="bg-gray-100 p-1.5 rounded-xl flex items-center relative w-full md:w-64 isolate">
          {/* Sliding Background */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-[-1] ${mode === 'buy' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'
              }`}
          ></div>

          <button
            onClick={() => setMode('buy')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 relative z-10 ${mode === 'buy'
              ? 'text-eco-darkGreen'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <ShoppingBag size={18} /> Buy
          </button>
          <button
            onClick={() => setMode('sell')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 relative z-10 ${mode === 'sell'
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Tag size={18} /> Sell
          </button>
        </div>
      </div>

      {/* MODE: BUY */}
      {mode === 'buy' && (
        <div className="animate-fade-in">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green outline-none transition-shadow"
            />
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-eco-green" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => openProductModal(product)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                >
                  {/* Product Image */}
                  <div className={`h-48 w-full ${product.isGradient ? `bg-gradient-to-br ${product.image}` : 'bg-gray-100'} relative`}>
                    {!product.isGradient && product.image && (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 shadow-sm">
                      {product.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-eco-green transition-colors">{product.title}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                      <button className="p-2 bg-gray-100 hover:bg-eco-green hover:text-white rounded-lg transition-colors">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-600">No items found</h3>
              <p className="text-gray-500">Be the first to list an item for sale!</p>
              <button onClick={() => setMode('sell')} className="mt-4 text-eco-green font-bold hover:underline">List Item</button>
            </div>
          )}
        </div>
      )}

      {/* MODE: SELL */}
      {mode === 'sell' && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-blue-50/50">
              <h3 className="text-lg font-bold text-gray-900">List New Item</h3>
              <p className="text-sm text-gray-500">Fill in the details to list your material for sale.</p>
            </div>

            <form onSubmit={handleSellSubmit} className="p-6 space-y-5">
              <Input
                label="Product Title *"
                placeholder="e.g. Copper Wire Scrap"
                value={sellForm.title}
                onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹) *"
                  type="number"
                  placeholder="0.00"
                  value={sellForm.price}
                  onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green bg-white"
                    value={sellForm.category}
                    onChange={(e) => setSellForm({ ...sellForm, category: e.target.value })}
                  >
                    <option value="Plastic">Plastic</option>
                    <option value="Metal">Metal</option>
                    <option value="Paper">Paper</option>
                    <option value="Glass">Glass</option>
                    <option value="E-Waste">E-Waste</option>
                    <option value="Textile">Textile</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Quantity / Unit"
                  placeholder="e.g. 50 kg"
                  value={sellForm.quantity}
                  onChange={(e) => setSellForm({ ...sellForm, quantity: e.target.value })}
                />
                <Input
                  label="Location"
                  placeholder="e.g. Mumbai"
                  value={sellForm.location}
                  onChange={(e) => setSellForm({ ...sellForm, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green transition-all"
                  placeholder="Describe condition, quantity, and packaging..."
                  value={sellForm.description}
                  onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                  required
                />
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center min-h-[240px] transition-all cursor-pointer relative group ${isDragActive
                    ? 'border-eco-green bg-eco-green/10 scale-[1.02]'
                    : 'border-gray-300 bg-gray-50 hover:border-eco-green hover:bg-eco-green/5'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {sellForm.imageUrl ? (
                    <div className="relative w-full h-full flex justify-center items-center">
                      <img src={sellForm.imageUrl} alt="Preview" className="max-h-48 object-contain rounded-lg shadow-sm" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Stop propagation to prevent file input trigger
                          setSellForm({ ...sellForm, imageUrl: '' });
                        }}
                        className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md z-20 hover:bg-red-50 text-red-500 border border-gray-200 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all shadow-sm border border-gray-100 ${isDragActive ? 'bg-white text-eco-green scale-110' : 'bg-white text-gray-400 group-hover:text-eco-green'
                        }`}>
                        <Upload size={28} />
                      </div>
                      <p className={`text-sm font-bold mb-1 transition-colors ${isDragActive ? 'text-eco-green' : 'text-gray-700'}`}>
                        {isDragActive ? 'Drop image here' : 'Click or drag image to upload'}
                      </p>
                      <p className="text-xs text-gray-400">SVG, PNG, JPG (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-6">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                >
                  <Tag size={20} />
                  List Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-48 w-full relative ${selectedProduct.isGradient ? `bg-gradient-to-br ${selectedProduct.image}` : 'bg-gray-100'}`}>
              {!selectedProduct.isGradient && selectedProduct.image && (
                <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.title}</h2>
              <h3 className="text-3xl font-bold text-eco-green mb-6">₹{selectedProduct.price.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ unit</span></h3>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 max-h-32 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed text-sm">{selectedProduct.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 rounded-md transition-colors text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-50 rounded-md transition-colors text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-right flex-1">
                  <p className="text-xs text-gray-500 font-medium">Total Price</p>
                  <p className="text-xl font-bold text-gray-900 animate-fade-in">₹{(selectedProduct.price * quantity).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} variant="outline" className="flex-1 gap-2">
                  <ShoppingBag size={18} /> Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1 gap-2">
                  <CreditCard size={18} /> Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialExchange;