import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { MarketplaceService, MarketplaceItem } from '../../services/MarketplaceService';
import Button from '../../ui/Button';

interface MarketplaceManagementProps {
    showToast?: (type: 'success' | 'error', msg: string) => void;
}

const MarketplaceManagement: React.FC<MarketplaceManagementProps> = ({ showToast }) => {
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        setLoading(true);
        try {
            const data = await MarketplaceService.getItems();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to remove this listing?')) return;
        try {
            await MarketplaceService.deleteItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
            if (showToast) showToast('success', 'Listing removed successfully');
        } catch (error) {
            console.error(error);
            if (showToast) showToast('error', 'Failed to remove listing');
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Marketplace Management</h3>
                    <p className="text-sm text-gray-500">Moderate user listings and material exchange.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search listings..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Item Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="m-2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{item.title}</p>
                                                    <p className="text-xs text-gray-500">{item.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{item.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove Listing"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            No listings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceManagement;
