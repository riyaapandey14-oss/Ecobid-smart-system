import React, { useState } from 'react';
import { Search, MapPin, Clock, Timer, Info, X, Filter } from 'lucide-react';
import Button from '../../ui/Button';
import { AuctionService } from '../../services/AuctionService';
import { UserService } from '../../services/UserService';
import VoiceAssistant from '../../VoiceAssistant';

interface LiveAuctionsProps {
    auctions: any[];
    onRefresh: () => void;
    showToast: (type: 'success' | 'error', msg: string) => void;
}

const LiveAuctions: React.FC<LiveAuctionsProps> = ({ auctions, onRefresh, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [activeBidModal, setActiveBidModal] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredAuctions = auctions.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const handlePlaceBid = async (amountString: string) => {
        const amount = parseInt(amountString);
        if (!activeBidModal) return;

        setIsLoading(true);

        try {
            await UserService.placeBid(activeBidModal.id, amount);
            showToast('success', `Bid of ₹${amount.toLocaleString()} placed successfully!`);
            onRefresh();
            setActiveBidModal(null);
        } catch (error: any) {
            showToast('error', error.message || 'Failed to place bid');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-0 z-10 transition-all">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        aria-label="Search auctions"
                        placeholder="Search by material, location..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-full lg:w-auto overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-1 px-1">
                        {['All', 'E-Waste', 'Plastic', 'Metal', 'Hazardous'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${categoryFilter === cat
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Auction Grid */}
            {filteredAuctions.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-600">No auctions found</h3>
                    <p className="text-gray-500">Try adjusting your filters.</p>
                    <button onClick={() => { setSearchTerm(''); setCategoryFilter('All') }} className="mt-4 text-eco-green font-bold hover:underline">Clear Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAuctions.map(auction => (
                        <div key={auction.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full active:scale-[0.99] transform">
                            {/* Card Header */}
                            {/* Card Header */}
                            <div className={`h-36 relative flex flex-col justify-between p-6 ${auction.image?.startsWith('from-') ? `bg-gradient-to-r ${auction.image}` : 'bg-gray-100'}`}>
                                {!(auction.image?.startsWith('from-')) && auction.image && (
                                    <img
                                        src={auction.image}
                                        alt={auction.title}
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 shadow-sm">
                                        {auction.category}
                                    </span>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm animate-pulse">
                                        <Clock size={12} /> {formatTime(auction.endsIn)}
                                    </span>
                                </div>
                                <h3 className="relative z-10 text-white font-bold text-lg leading-tight drop-shadow-md">{auction.title}</h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Location</p>
                                        <p className="font-medium text-gray-700 flex items-center gap-1 truncate">
                                            <MapPin size={14} className="text-gray-400" /> {auction.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Quantity</p>
                                        <p className="font-medium text-gray-700">{auction.quantity}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100 mt-auto">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">Current Highest Bid</p>
                                            <p className="text-2xl font-bold text-gray-900">₹{auction.currentBid.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">Base Price</p>
                                            <p className="text-sm font-medium text-gray-600 line-through">₹{auction.basePrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <Button onClick={() => setActiveBidModal(auction)} className="shadow-md">
                                    Place Bid
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bid Modal */}
            {activeBidModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900">Place Your Bid</h3>
                                <p className="text-xs text-gray-500">Lot #{activeBidModal.id}</p>
                            </div>
                            <button title="Close Modal" onClick={() => setActiveBidModal(null)} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e: any) => { e.preventDefault(); handlePlaceBid(e.target.amount.value); }}>
                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden ${activeBidModal.image?.startsWith('from-') ? `bg-gradient-to-br ${activeBidModal.image}` : 'bg-gray-100'}`}>
                                        {!(activeBidModal.image?.startsWith('from-')) && activeBidModal.image && (
                                            <img src={activeBidModal.image} alt={activeBidModal.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{activeBidModal.title}</h4>
                                        <p className="text-sm text-gray-500">{activeBidModal.quantity} • {activeBidModal.location}</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-blue-700 font-medium">Current Highest Bid</span>
                                        <span className="text-lg font-bold text-blue-800">₹{activeBidModal.currentBid.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-blue-600">
                                        <span>Min. Increment: ₹500</span>
                                        <span className="flex items-center gap-1"><Timer size={12} /> Ends in {formatTime(activeBidModal.endsIn)}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount (₹)</label>
                                        <input
                                            id="bidAmount"
                                            name="amount"
                                            type="number"
                                            title="Bid Amount"
                                            placeholder="Enter amount"
                                            className="w-full text-2xl font-bold p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green outline-none transition-shadow"
                                            defaultValue={activeBidModal.currentBid + 500}
                                            min={activeBidModal.currentBid + 500}
                                            step="500"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg text-xs text-gray-500">
                                        <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <p>5% EMD (approx ₹{Math.floor((activeBidModal.currentBid + 500) * 0.05).toLocaleString()}) will be blocked from your wallet. Refundable if you lose.</p>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Button type="button" variant="outline" onClick={() => setActiveBidModal(null)}>Cancel</Button>
                                    <Button type="submit" isLoading={isLoading}>Confirm Bid</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* AI Voice Assistant */}
            <VoiceAssistant />
        </div>
    );
};

export default LiveAuctions;