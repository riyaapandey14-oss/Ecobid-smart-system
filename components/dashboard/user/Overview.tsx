import React from 'react';
import { Gavel, CheckCircle2, CreditCard, TrendingUp, MapPin, Clock, ChevronRight } from 'lucide-react';
import Button from '../../ui/Button';

interface OverviewProps {
  user: any;
  bids: any[];
  auctions: any[];
  onNavigate: (view: any) => void;
}

const Overview: React.FC<OverviewProps> = ({ user, bids, auctions, onNavigate }) => {
  
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="animate-fade-in-up space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-eco-green opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, <span className="text-eco-green">{user.name.split(' ')[0]}</span></h1>
                <p className="text-gray-300 max-w-xl text-sm md:text-base leading-relaxed">
                    You have <span className="font-bold text-white">{bids.filter(b => b.status === 'Leading').length} active bids</span> and <span className="font-bold text-white">{auctions.length} live auctions</span> available. 
                    Markets are trending up for {auctions[0]?.category || 'Recyclables'}.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Button className="w-full sm:w-auto px-6 h-10 sm:h-12" onClick={() => onNavigate('auctions')}>Find Auctions</Button>
                    <Button variant="outline" className="w-full sm:w-auto px-6 h-10 sm:h-12 border-white text-white hover:bg-white/10" onClick={() => onNavigate('my-bids')}>View My Bids</Button>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Gavel} label="Active Bids" value={bids.filter(b => b.status === 'Leading' || b.status === 'Outbid').length.toString()} trend="Live Updates" color="text-blue-600" bg="bg-blue-50" />
            <StatCard icon={CheckCircle2} label="Auctions Won" value={bids.filter(b => b.status === 'Won').length.toString()} trend="All time" color="text-eco-green" bg="bg-green-50" />
            <StatCard icon={CreditCard} label="Wallet Balance" value={`₹${(user.walletBalance / 1000).toFixed(1)}k`} trend="Available" color="text-purple-600" bg="bg-purple-50" />
            <StatCard icon={TrendingUp} label="Blocked EMD" value={`₹${(user.emdBlocked / 1000).toFixed(1)}k`} trend="In Escrow" color="text-orange-600" bg="bg-orange-50" />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">Trending Auctions</h3>
                    <button onClick={() => onNavigate('auctions')} className="text-sm text-eco-green hover:underline flex items-center">View All <ChevronRight size={16} /></button>
                </div>
                <div className="space-y-4 flex-1">
                    {auctions.slice(0, 3).map(auction => (
                        <div key={auction.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer group" onClick={() => onNavigate('auctions')}>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${auction.image} flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                                {auction.category.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{auction.title}</h4>
                                <p className="text-xs text-gray-500 truncate">{auction.location} • {auction.quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-bold text-eco-green text-sm">₹{auction.currentBid.toLocaleString()}</p>
                                <p className="text-xs text-red-500 font-medium">{formatTime(auction.endsIn)} left</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">Recent Bids</h3>
                    <button onClick={() => onNavigate('my-bids')} className="text-sm text-eco-green hover:underline flex items-center">Full Report <ChevronRight size={16} /></button>
                </div>
                <div className="space-y-4 flex-1">
                    {bids.slice(0, 3).map(bid => (
                        <div key={bid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                            <div className="min-w-0 pr-2">
                                <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{bid.auctionTitle}</h4>
                                <p className="text-xs text-gray-500">My Bid: ₹{bid.bidAmount.toLocaleString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                bid.status === 'Won' ? 'bg-green-100 text-green-700' :
                                bid.status === 'Leading' ? 'bg-blue-100 text-blue-700' :
                                bid.status === 'Outbid' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {bid.status}
                            </span>
                        </div>
                    ))}
                    {bids.length === 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No bids placed yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend, color, bg }: any) => (
  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
    <p className={`text-xs font-medium flex items-center gap-1 ${color}`}>
      {trend}
    </p>
  </div>
);

export default Overview;