import { useState, useEffect, FC, FormEvent } from 'react';
import { X, CreditCard, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface MockPaymentGatewayProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    onSuccess: () => void;
}

const MockPaymentGateway: FC<MockPaymentGatewayProps> = ({ isOpen, onClose, amount, onSuccess }) => {
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('details');
            setCardNumber('');
            setExpiry('');
            setCvv('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePay = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3) {
            setError('Please enter valid dummy card details.');
            return;
        }

        setStep('processing');

        // Simulate network delay
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    // Formatters for inputs
    const formatCardNumber = (val: string) => {
        return val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val: string) => {
        return val.replace(/\D/g, '').substring(0, 4).replace(/^(\d{2})/, '$1/').replace(/^\/\//, '/'); // Simple logic
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative">

                {/* Close Button */}
                {step !== 'processing' && (
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Content */}
                <div className="p-8">

                    {step === 'details' && (
                        <form onSubmit={handlePay} className="animate-fade-in">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                                <p className="text-gray-500 text-sm mt-1">Mock Gateway &bull; Test Mode</p>
                                <div className="mt-4 text-3xl font-bold text-gray-900">
                                    ₹{amount.toLocaleString()}
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value.replace(/\s/g, '')))}
                                            maxLength={19}
                                        />
                                        <CreditCard size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-center"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            maxLength={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CVV</label>
                                        <input
                                            type="password"
                                            placeholder="123"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-center"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                            maxLength={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20">
                                Pay ₹{amount.toLocaleString()}
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <Shield size={12} />
                                <span>256-bit SSL Encrypted (Mock)</span>
                            </div>
                        </form>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 text-center animate-fade-in">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                            <p className="text-gray-500">Please do not close this window...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-12 text-center animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-up">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                            <p className="text-gray-500">Transaction ID: #MOCK_{Math.floor(Math.random() * 100000)}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default MockPaymentGateway;
