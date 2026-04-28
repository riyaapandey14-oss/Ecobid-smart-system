import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../../ui/Button';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image?: string;
  isGradient: boolean;
  quantity: number;
  category: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout 
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
       {/* Backdrop */}
       <div 
         className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={onClose}
       />
       
       {/* Drawer */}
       <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
             {/* Header */}
             <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-eco-green/10 rounded-full text-eco-green">
                       <ShoppingBag size={20} />
                   </div>
                   <h2 className="text-xl font-bold text-gray-900">Your Cart ({items.length})</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                   <X size={20} />
                </button>
             </div>

             {/* Items List */}
             <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4 opacity-60">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <ShoppingBag size={40} className="text-gray-400" />
                      </div>
                      <div>
                          <p className="text-lg font-bold text-gray-700">Your cart is empty</p>
                          <p className="text-sm">Add materials from the Exchange to get started.</p>
                      </div>
                      <Button variant="outline" onClick={onClose} className="mt-4">Start Browsing</Button>
                   </div>
                ) : (
                   items.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-eco-green/30 hover:bg-gray-50 transition-all group shadow-sm bg-white">
                         <div className={`w-20 h-20 rounded-lg flex-shrink-0 ${item.isGradient ? `bg-gradient-to-br ${item.image}` : 'bg-gray-100'} overflow-hidden relative`}>
                             {!item.isGradient && item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                         </div>
                         <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                               <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                               <p className="text-xs text-gray-500 font-medium bg-gray-100 w-fit px-2 py-0.5 rounded-full mt-1">{item.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                               <p className="font-bold text-eco-green">₹{(item.price * item.quantity).toLocaleString()}</p>
                               <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:bg-gray-50 text-gray-600 rounded-l-lg transition-colors"><Minus size={14} /></button>
                                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:bg-gray-50 text-gray-600 rounded-r-lg transition-colors"><Plus size={14} /></button>
                               </div>
                            </div>
                         </div>
                         <button onClick={() => onRemove(item.id)} className="p-2 text-gray-300 hover:text-red-500 self-start transition-colors -mr-2 -mt-2">
                            <Trash2 size={18} />
                         </button>
                      </div>
                   ))
                )}
             </div>

             {/* Footer */}
             {items.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                   <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Platform Fee (1%)</span>
                            <span>₹{Math.floor(total * 0.01).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-eco-green">₹{(total + Math.floor(total * 0.01)).toLocaleString()}</span>
                        </div>
                   </div>
                   <Button onClick={onCheckout} className="w-full py-4 text-lg shadow-xl shadow-eco-green/20 group">
                      Checkout <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
             )}
          </div>
       </div>
    </>
  );
};

export default CartDrawer;