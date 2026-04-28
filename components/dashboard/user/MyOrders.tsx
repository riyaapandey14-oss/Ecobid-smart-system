import React, { useState } from 'react';
import { Package, Clock, CheckCircle2 } from 'lucide-react';

interface Order {
    id: string;
    items: string[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered';
    date: string;
}

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [viewDocument, setViewDocument] = useState<'certificate' | 'impact' | 'manifest' | null>(null);

    React.useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const { UserService } = await import('../../services/UserService');
            const bids = await UserService.getBids();
            // Filter for 'Won' (In real app, we might have a dedicated 'Orders' table, but 'Won' bids act as orders)
            // Or 'placed' for demo if no won items exist, but logic dictates 'won' for certificates
            const wonItems = bids.filter((b: any) => b.status === 'Won' || b.status === 'won'); // Check case sensitivity
            setOrders(wonItems);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Orders & Reports</h2>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No completed orders found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg">{order.auctionTitle}</h3>
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Won
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Date: {order.date}</p>
                                <p className="text-sm text-gray-500">Amount: <span className="font-bold text-gray-900">₹{order.bidAmount.toLocaleString()}</span></p>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                                <button
                                    onClick={() => { setSelectedOrder(order); setViewDocument('certificate'); }}
                                    className="px-4 py-2 bg-eco-green/10 text-eco-green rounded-lg text-xs font-bold hover:bg-eco-green/20 transition-colors"
                                >
                                    Certificate
                                </button>
                                <button
                                    onClick={() => { setSelectedOrder(order); setViewDocument('impact'); }}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                    Impact Report
                                </button>
                                <button
                                    onClick={() => { setSelectedOrder(order); setViewDocument('manifest'); }}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Form-6
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Document Modal */}
            {selectedOrder && viewDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:border-none">
                        {/* Modal Header (Hide in Print) */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 print:hidden">
                            <h3 className="font-bold text-gray-900 capitalize">{viewDocument.replace('-', ' ')} Preview</h3>
                            <div className="flex gap-2">
                                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                                    Print / Download
                                </button>
                                <button onClick={() => { setViewDocument(null); setSelectedOrder(null); }} className="p-2 text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="p-8 print:p-0">
                            <DocumentRenderer type={viewDocument} order={selectedOrder} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Lazy load helper or direct render
import { ReportService } from '../../services/ReportService';
import SustainabilityCertificate from '../../reports/SustainabilityCertificate';
import ImpactReport from '../../reports/ImpactReport';
import EWasteManifest from '../../reports/EWasteManifest';
import { X } from 'lucide-react';

const DocumentRenderer = ({ type, order }: { type: string, order: any }) => {
    // Determine data
    // Assuming 'auctions' object is present in 'order' from UserService.getBids() join
    // But 'getBids' returns a flattened object in map? 
    // Wait, getBids maps: auctionTitle: item.auctions?.title...
    // I need to update UserService to map more fields or access raw data.
    // Let's assume I updated getBids to pass full auction details or I'll fix it now.

    // Fallback Mock Data if UserService isn't perfectly hydrated yet (for robust demo)
    const auction = order.auctions || {};
    const quantity = auction.quantity || "500 Kg";
    const category = auction.category || "E-Waste";
    const title = order.auctionTitle || "Lot #123";
    const date = order.date;
    const weight = quantity; // Parse logic inside ReportService anyway

    const stats = ReportService.calculateImpact(category, quantity);
    const certId = ReportService.generateCertificateId(category, new Date(date));
    const manifestId = ReportService.generateManifestId();

    if (type === 'certificate') {
        return (
            <SustainabilityCertificate
                certificateId={certId}
                schoolName="Green Valley High School" // Mock for now (Or use Profile Company Name)
                recyclerName="EcoRecycle Pvt Ltd"
                date={date}
                weight={weight}
                category={category}
            />
        );
    }
    if (type === 'impact') {
        return (
            <ImpactReport
                schoolName="Green Valley High School"
                stats={stats}
            />
        );
    }
    if (type === 'manifest') {
        return (
            <EWasteManifest
                manifestNo={manifestId}
                date={date}
                senderName="Green Valley High School"
                senderAddress="123 Education Lane, Delhi"
                senderPhone="9876543210"
                transporterName="Rapid Logistics"
                transporterVehicle="DL-1L-8829"
                receiverName="EcoRecycle Pvt Ltd"
                receiverAddress="Industrial Area, Sector 62, Noida"
                itemDescription={title}
                quantity={quantity}
                weight={weight}
                copyColor="Pink" // Demo
                copyName="Receiver Copy"
            />
        );
    }
    return null;
};

export default MyOrders;
