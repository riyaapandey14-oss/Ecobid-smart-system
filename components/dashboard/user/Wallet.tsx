import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Shield, Plus, Download, X } from 'lucide-react';
import Button from '../../ui/Button';
import { UserService } from '../../services/UserService';

interface WalletProps {
    user: any;
    transactions: any[];
    onRefresh: () => void;
    showToast: (type: 'success' | 'error', msg: string) => void;
    openAddMoneyModal: boolean;
    setOpenAddMoneyModal: (open: boolean) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, transactions, onRefresh, showToast, openAddMoneyModal, setOpenAddMoneyModal }) => {
    const [isLoading, setIsLoading] = useState(false);
    const availableBalance = user.walletBalance - user.emdBlocked;

    const handleAddMoney = (amountString: string) => {
        const amount = parseInt(amountString);
        if (isNaN(amount) || amount <= 0) {
            showToast('error', 'Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            UserService.addFunds(amount);
            showToast('success', `₹${amount.toLocaleString()} added to wallet!`);
            onRefresh();
            setOpenAddMoneyModal(false);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="animate-fade-in-up space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Wallet & Payments</h2>

            {/* Wallet Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Balance */}
                <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-auto min-h-[250px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-gray-400 font-medium mb-1">Total Balance</p>
                            <h3 className="text-3xl md:text-4xl font-bold">₹ {user.walletBalance.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <WalletIcon size={32} className="text-eco-green" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 relative z-10 mt-6 mb-6">
                        <div className="bg-white/5 p-3 rounded-lg sm:bg-transparent sm:p-0">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">EMD Blocked</p>
                            <p className="text-lg md:text-xl font-bold text-red-400">₹ {user.emdBlocked.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg sm:bg-transparent sm:p-0">
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Available</p>
                            <p className="text-lg md:text-xl font-bold text-eco-green">₹ {availableBalance.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto relative z-10">
                        <Button onClick={() => setOpenAddMoneyModal(true)} className="h-10 text-sm bg-eco-green hover:bg-eco-darkGreen text-white border-none justify-center">
                            <Plus size={16} className="mr-2" /> Add Funds
                        </Button>
                        <Button variant="outline" className="h-10 text-sm border-white/20 text-white hover:bg-white/10 justify-center">
                            <ArrowUpRight size={16} className="mr-2" /> Withdraw
                        </Button>
                    </div>
                </div>

                {/* Quick Actions / Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Shield size={32} />
                        </div>
                        <h4 className="font-bold text-gray-900">Secure Payments</h4>
                        <p className="text-sm text-gray-500 mt-2">All transactions are secured with 256-bit encryption and monitored for fraud.</p>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Transaction History</h3>
                    <button className="text-gray-400 hover:text-gray-600"><Download size={20} /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-4 md:px-6 py-4">Description</th>
                                <th className="hidden md:table-cell px-6 py-4">Transaction ID</th>
                                <th className="hidden sm:table-cell px-6 py-4">Date</th>
                                <th className="px-4 md:px-6 py-4">Amount</th>
                                <th className="px-4 md:px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map(txn => (
                                <tr key={txn.id} className="hover:bg-gray-50">
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${txn.type === 'Credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {txn.type === 'Credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900 line-clamp-1">{txn.desc}</span>
                                                <span className="text-xs text-gray-400 md:hidden block font-mono mt-0.5">{txn.id}</span>
                                                <span className="text-xs text-gray-400 sm:hidden block mt-0.5">{txn.date}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 text-sm font-mono text-gray-500">{txn.id}</td>
                                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                                    <td className={`px-4 md:px-6 py-4 font-bold ${txn.type === 'Credit' ? 'text-green-600' : 'text-gray-800'}`}>
                                        {txn.type === 'Credit' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${txn.status === 'Success' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Funds Modal */}
            {openAddMoneyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Add Funds</h3>
                            <button onClick={() => setOpenAddMoneyModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={(e: any) => { e.preventDefault(); handleAddMoney(e.target.amount.value); }}>
                            <div className="p-6">
                                <p className="text-gray-500 text-sm mb-4">Add money to your wallet to participate in auctions and pay EMD.</p>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            name="amount"
                                            type="number"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-eco-green/20 focus:border-eco-green outline-none text-lg font-bold"
                                            placeholder="0.00"
                                            min="100"
                                            step="100"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" isLoading={isLoading}>Proceed to Pay</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;