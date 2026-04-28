import React, { useState, useEffect } from 'react';
import { Package, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
import MarketplaceManagement from '../admin/MarketplaceManagement';
import { MarketplaceService, MarketplaceItem } from '../../services/MarketplaceService';
import Button from '../../ui/Button';
import SmartPriceWidget from './SmartPriceWidget';

interface MyListingsProps {
    showToast: (type: 'success' | 'error', msg: string) => void;
}

const MyListings: React.FC<MyListingsProps> = ({ showToast }) => {
    const [listings, setListings] = useState<MarketplaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newItemCategory, setNewItemCategory] = useState('');
    const [newItemPrice, setNewItemPrice] = useState(0);

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await import('../../lib/supabaseClient').then(m => m.supabase.auth.getUser());

            if (user) {
                // Fetch all and filter by seller_id (since we haven't implemented getUserItems in service yet)
                // Or better, let's just assume getItems returns all and we filter
                const allItems = await MarketplaceService.getItems();
                const myItems = allItems.filter(item => item.sellerId === user.id);
                setListings(myItems);
            }
        } catch (error) {
            console.error("Failed to load listings", error);
            showToast('error', 'Failed to load your listings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        try {
            await MarketplaceService.deleteItem(id);
            setListings(prev => prev.filter(item => item.id !== id));
            showToast('success', 'Listing deleted successfully');
        } catch (error) {
            console.error("Delete failed", error);
            showToast('error', 'Failed to delete listing');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-eco-green" size={32} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                <div className="flex gap-2">
                    <Button onClick={() => setShowCreateModal(true)}>+ Create Listing</Button>
                    <Button variant="outline" onClick={loadListings}>Refresh</Button>
                </div>
            </div>

            {/* Simulated Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Create New Listing</h3>
                            <button title="Close Modal" onClick={() => setShowCreateModal(false)}><Loader2 className="text-gray-400 rotate-45" size={24} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    aria-label="Select Category"
                                    className="w-full p-2 border rounded-lg"
                                    onChange={(e) => setNewItemCategory(e.target.value)}
                                >
                                    <option value="">Select Category...</option>
                                    <option value="Plastic (PET)">Plastic (PET)</option>
                                    <option value="Copper Wire">Copper Wire</option>
                                    <option value="Aluminum Cans">Aluminum Cans</option>
                                </select>
                            </div>

                            {/* AI Widget */}
                            {newItemCategory && (
                                <SmartPriceWidget
                                    category={newItemCategory}
                                    onPriceSelected={(p) => setNewItemPrice(p)}
                                />
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Price (₹/kg)</label>
                                <input
                                    aria-label="Price per kg"
                                    type="number"
                                    className="w-full p-2 border rounded-lg font-bold"
                                    value={newItemPrice}
                                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                                />
                            </div>

                            <Button className="w-full mt-4" onClick={() => {
                                showToast('success', 'Listing created successfully!');
                                setShowCreateModal(false);
                            }}>
                                Publish Listing
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {listings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">You haven't listed any items yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {listings.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                            <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.category} • {item.quantity}</p>
                                <p className="font-bold text-eco-green mt-1">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={() => handleDelete(item.id)}
                                    title="Delete Listing"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
