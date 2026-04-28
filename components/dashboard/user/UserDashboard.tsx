import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Gavel, Wallet, Settings as SettingsIcon, Bell, LogOut,
  Menu, X, Plus, AlertCircle, CheckCircle2, Info, ShoppingBag, Package, Sparkles
} from 'lucide-react';
import Logo from '../../Logo';
import { AuthService } from '../../services/AuthService';
import { AuctionService } from '../../services/AuctionService';
import { UserService } from '../../services/UserService';

// Import Views
import Overview from './Overview';
import LiveAuctions from './LiveAuctions';
import MyBids from './MyBids';
import UserWallet from './Wallet';
import UserSettings from './Settings';
import MaterialExchange from './MaterialExchange';
import CartDrawer from './CartDrawer';
import MyListings from './MyListings';
import MyOrders from './MyOrders';
import AILabs from './AILabs';

type ViewState = 'dashboard' | 'my-bids' | 'auctions' | 'wallet' | 'settings' | 'exchange' | 'my-listings' | 'my-orders' | 'ai-labs';

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [user, setUser] = useState<any>({
    name: 'Guest User', type: 'Guest', walletBalance: 0, emdBlocked: 0
  });
  const [auctions, setAuctions] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Cart State
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Shared UI State
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Refresh data on mount and view change
  useEffect(() => {
    refreshData();
  }, [currentView]);

  const refreshData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser({
          ...currentUser,
          name: currentUser.fullName || currentUser.email?.split('@')[0] || 'User',
          type: currentUser.role === 'admin' ? 'Administrator' : 'Recycler', // Default type
          walletBalance: currentUser.walletBalance || 0,
          emdBlocked: currentUser.emdBlocked || 0,
          company: currentUser.company || 'Eco Company',
          address: currentUser.address || 'Unknown'
        });
      }

      setAuctions(await AuctionService.getAuctions());
      setBids(await UserService.getBids());
      setTransactions(await UserService.getTransactions());
      setNotifications(await UserService.getNotifications());
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastMessage({ type, msg });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkNotificationsRead = async () => {
    await UserService.markNotificationsRead();
    setNotifications(await UserService.getNotifications());
  };

  // Cart Functions
  const addToCart = (product: any, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    // Optional: open cart immediately to show feedback
    // setIsCartOpen(true); 
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    showToast('success', 'Order placed successfully! We will contact you for delivery.');
    setCart([]);
    setIsCartOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const availableBalance = user.walletBalance - user.emdBlocked;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl shadow-2xl animate-fade-in-up flex items-center gap-3 ${toastMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
          }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{toastMessage.msg}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="scale-75 origin-left">
            <Logo variant="dark" showTagline={false} />
          </div>
          <button aria-label="Close Sidebar" onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} />
          <NavItem icon={Gavel} label="My Bids" badge={bids.filter(b => b.status === 'Leading').length.toString()} active={currentView === 'my-bids'} onClick={() => { setCurrentView('my-bids'); setSidebarOpen(false); }} />
          <NavItem icon={SettingsIcon} label="Live Auctions" active={currentView === 'auctions'} onClick={() => { setCurrentView('auctions'); setSidebarOpen(false); }} />
          <NavItem icon={ShoppingBag} label="Material Exchange" active={currentView === 'exchange'} onClick={() => { setCurrentView('exchange'); setSidebarOpen(false); }} />
          <NavItem icon={Package} label="My Listings" active={currentView === 'my-listings'} onClick={() => { setCurrentView('my-listings'); setSidebarOpen(false); }} />
          <NavItem icon={CheckCircle2} label="My Orders" active={currentView === 'my-orders'} onClick={() => { setCurrentView('my-orders'); setSidebarOpen(false); }} />
          <NavItem icon={Wallet} label="Wallet & EMD" active={currentView === 'wallet'} onClick={() => { setCurrentView('wallet'); setSidebarOpen(false); }} />
          <NavItem icon={Sparkles} label="AI Labs (Beta)" active={currentView === 'ai-labs'} onClick={() => { setCurrentView('ai-labs'); setSidebarOpen(false); }} />
          <NavItem icon={SettingsIcon} label="Settings" active={currentView === 'settings'} onClick={() => { setCurrentView('settings'); setSidebarOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-eco-green to-eco-darkGreen rounded-xl p-4 text-white mb-4 shadow-lg shadow-eco-green/20">
            <p className="text-xs font-medium opacity-80 mb-1">Available Balance</p>
            <h3 className="text-2xl font-bold">₹ {availableBalance.toLocaleString()}</h3>
            <button onClick={() => { setShowAddMoneyModal(true); setSidebarOpen(false); }} className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Add Funds
            </button>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-gray-500 hover:text-red-600 transition-colors w-full px-4 py-3 rounded-lg hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              aria-label="Open Sidebar"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden md:block capitalize">
              {currentView.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              title="View Cart"
            >
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-eco-green rounded-full border-2 border-white shadow-sm animate-fade-in">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up origin-top-right">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkNotificationsRead} className="text-xs text-eco-green font-bold hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell size={32} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${!n.read ? 'bg-blue-50/40' : ''}`}>
                            <div className={`mt-1 p-2 rounded-full flex-shrink-0 h-fit ${n.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                              n.type === 'success' ? 'bg-green-100 text-green-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                              {n.type === 'warning' ? <AlertCircle size={16} /> :
                                n.type === 'success' ? <CheckCircle2 size={16} /> :
                                  <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-0.5">
                                <p className={`text-sm text-gray-800 ${!n.read ? 'font-bold' : 'font-semibold'}`}>{n.title}</p>
                                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>}
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2 font-medium">{n.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                      <button onClick={() => { setCurrentView('settings'); setShowNotifications(false); }} className="text-xs font-bold text-gray-500 hover:text-gray-800 py-1">
                        Notification Settings
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200" onClick={() => setCurrentView('settings')}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-eco-green to-eco-teal flex items-center justify-center text-white font-bold shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block pr-2">
                <p className="text-sm font-bold text-gray-800 leading-tight">{user.name}</p>
                <p className="text-xs uppercase font-semibold text-gray-500 tracking-wide">{user.type}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div key={currentView} className="animate-fade-in">
            {currentView === 'dashboard' && (
              <Overview
                user={user}
                bids={bids}
                auctions={auctions}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'auctions' && (
              <LiveAuctions
                auctions={auctions}
                onRefresh={refreshData}
                showToast={showToast}
              />
            )}

            {currentView === 'exchange' && (
              <MaterialExchange
                showToast={showToast}
                addToCart={addToCart}
              />
            )}

            {currentView === 'my-listings' && (
              <MyListings
                showToast={showToast}
              />
            )}

            {currentView === 'my-orders' && (
              <MyOrders />
            )}

            {currentView === 'my-bids' && (
              <MyBids
                bids={bids}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'wallet' && (
              <UserWallet
                user={user}
                transactions={transactions}
                onRefresh={refreshData}
                showToast={showToast}
                openAddMoneyModal={showAddMoneyModal}
                setOpenAddMoneyModal={setShowAddMoneyModal}
              />
            )}

            {currentView === 'ai-labs' && (
              <AILabs />
            )}

            {currentView === 'settings' && (
              <UserSettings
                user={user}
                showToast={showToast}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false, badge, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-eco-green text-white shadow-md shadow-eco-green/20' : 'text-gray-600 hover:bg-gray-100'}`}>
    <div className="flex items-center gap-3">
      <Icon size={20} className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span className="font-medium">{label}</span>
    </div>
    {badge && (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default UserDashboard;