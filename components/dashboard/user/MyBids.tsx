import React from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface MyBidsProps {
  bids: any[];
  onNavigate: (view: any) => void;
}

const MyBids: React.FC<MyBidsProps> = ({ bids, onNavigate }) => {
  return (
    <div className="animate-fade-in-up space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
                <p className="text-gray-500">Track the status of your active and past bids.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 self-start sm:self-auto">
                    <button className="px-4 py-1.5 bg-slate-100 text-slate-800 rounded-md text-sm font-bold shadow-sm">All</button>
                    <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium">Active</button>
                    <button className="px-4 py-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium">Won</button>
                </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-4 md:px-6 py-4">Auction Details</th>
                            <th className="px-4 md:px-6 py-4">Bid Amount</th>
                            <th className="hidden md:table-cell px-6 py-4">Date</th>
                            <th className="hidden sm:table-cell px-6 py-4">Status</th>
                            <th className="px-4 md:px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bids.map(bid => (
                            <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 md:px-6 py-4">
                                    <p className="font-bold text-gray-900 line-clamp-1">{bid.auctionTitle}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-400">ID: #{bid.id}</p>
                                        <span className={`sm:hidden inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                            bid.status === 'Won' ? 'bg-green-50 text-green-700 border-green-200' :
                                            bid.status === 'Leading' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            bid.status === 'Outbid' ? 'bg-red-50 text-red-700 border-red-200' : 
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {bid.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 md:hidden mt-1">{bid.date}</p>
                                </td>
                                <td className="px-4 md:px-6 py-4 font-mono font-medium text-gray-700">
                                    ₹{bid.bidAmount.toLocaleString()}
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                                    {bid.date}
                                </td>
                                <td className="hidden sm:table-cell px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        bid.status === 'Won' ? 'bg-green-50 text-green-700 border-green-200' :
                                        bid.status === 'Leading' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        bid.status === 'Outbid' ? 'bg-red-50 text-red-700 border-red-200' : 
                                        'bg-gray-100 text-gray-600 border-gray-200'
                                    }`}>
                                        {bid.status === 'Won' && <CheckCircle2 size={12} />}
                                        {bid.status === 'Outbid' && <AlertCircle size={12} />}
                                        {bid.status === 'Leading' && <Clock size={12} />}
                                        {bid.status}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-4 text-right">
                                    {bid.status === 'Outbid' && (
                                        <button onClick={() => onNavigate('auctions')} className="text-xs font-bold text-white bg-eco-green hover:bg-eco-darkGreen px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                                            Increase Bid
                                        </button>
                                    )}
                                    {bid.status === 'Won' && (
                                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                            View Invoice
                                        </button>
                                    )}
                                    {bid.status === 'Leading' && (
                                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Wait for close</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {bids.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No bids placed yet.</p>
                    <button onClick={() => onNavigate('auctions')} className="text-eco-green font-bold text-sm mt-2 hover:underline">Start Bidding</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default MyBids;