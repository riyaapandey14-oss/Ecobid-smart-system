import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { AuctionService } from '../../services/AuctionService';
import { AuditService } from '../../../utils/audit';

interface AddAuctionProps {
    onBack: () => void;
    editData?: any;
}

const AddAuction: React.FC<AddAuctionProps> = ({ onBack, editData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Metal',
        location: '',
        quantity: '',
        basePrice: '',
        reservePrice: ''
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || '',
                description: editData.description || '',
                category: editData.category || 'Metal',
                location: editData.location || '',
                quantity: editData.quantity || '',
                basePrice: editData.basePrice?.toString() || '',
                reservePrice: editData.reservePrice?.toString() || ''
            });

            // Check if image is a URL (not a gradient string)
            if (editData.image && !editData.image.startsWith('from-')) {
                setImagePreview(editData.image);
            }
        }
    }, [editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.title || !formData.quantity || !formData.basePrice) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        try {
            const auctionData = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                reservePrice: formData.reservePrice ? parseFloat(formData.reservePrice) : undefined,
                image: imagePreview || undefined // In a real app, this would be an uploaded URL
            };

            if (editData) {
                await AuctionService.updateAuction(editData.id, auctionData);
                AuditService.logAction({
                    adminName: 'Super Admin',
                    action: 'Update Auction',
                    target: `Auction: ${formData.title}`,
                    details: `Updated details for auction ID #${editData.id}`,
                    status: 'Success'
                });
            } else {
                await AuctionService.createAuction(auctionData);
                AuditService.logAction({
                    adminName: 'Super Admin',
                    action: 'Create Auction',
                    target: `Auction: ${formData.title}`,
                    details: `Created new auction in ${formData.category}`,
                    status: 'Success'
                });
            }

            onBack();
        } catch (err) {
            console.error(err);
            setError('Failed to save auction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{editData ? 'Edit Auction' : 'Create New Auction'}</h2>
                    <p className="text-sm text-gray-500">
                        {editData ? 'Update the details for this auction listing.' : 'Fill in the details to publish a new auction listing.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl mx-auto">
                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Details */}
                    <div className="space-y-6">
                        <div>
                            <Input
                                label="Auction Title *"
                                name="title"
                                placeholder="e.g. Bulk Copper Scrap Grade A"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green outline-none transition-all text-gray-800"
                                placeholder="Detailed description of the material, condition, origin..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        className="w-full appearance-none px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green outline-none bg-white text-gray-800"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="Metal">Metal</option>
                                        <option value="Plastic">Plastic</option>
                                        <option value="E-Waste">E-Waste</option>
                                        <option value="Hazardous">Hazardous</option>
                                        <option value="Paper">Paper</option>
                                        <option value="Glass">Glass</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <Input
                                    label="Quantity *"
                                    name="quantity"
                                    placeholder="e.g. 500 kg"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Location *"
                                name="location"
                                placeholder="e.g. Industrial Area, Mumbai"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Right Column - Pricing & Image */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">Pricing Strategy</h3>
                            <Input
                                label="Base Price (Starting Bid) *"
                                name="basePrice"
                                type="number"
                                placeholder="0.00"
                                value={formData.basePrice}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Reserve Price (Hidden Minimum)"
                                name="reservePrice"
                                type="number"
                                placeholder="0.00"
                                value={formData.reservePrice}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <AlertCircle size={12} />
                                Base Price is visible to all. Reserve price remains hidden until met.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Auction Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] hover:border-eco-green hover:bg-eco-green/5 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-eco-green group-hover:bg-white transition-colors mb-3">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        className="w-auto px-6 text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-auto px-8"
                    >
                        {editData ? 'Update Auction' : 'Publish Auction'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddAuction;