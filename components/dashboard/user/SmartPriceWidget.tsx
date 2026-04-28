import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Loader2, ArrowRight, DollarSign, Sparkles } from 'lucide-react';
import { AILabsService } from '../../../utils/aiLabsService';
import Button from '../../ui/Button';

interface SmartPriceWidgetProps {
    category: string;
    onPriceSelected: (price: number) => void;
}

const SmartPriceWidget: React.FC<SmartPriceWidgetProps> = ({ category, onPriceSelected }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (category) {
            fetchPrediction();
        }
    }, [category]);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const pred = await AILabsService.getPriceForecast(category);
            setData(pred);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!category) return null;

    if (loading) {
        return (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-indigo-700">AI is analyzing {category} market trends...</span>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-4 bg-gradient-to-br from-white to-indigo-50/50 rounded-lg border border-indigo-100 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <Sparkles size={18} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">AI Price Recommendation</h4>
                    <p className="text-xs text-gray-500 mt-1">{data.trend} • {data.recommendation}</p>

                    <div className="mt-3 flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase">Fair Market Value</span>
                            <div className="text-xl font-bold text-gray-800">₹{data.currentPrice}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => onPriceSelected(data.currentPrice)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Apply Price
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartPriceWidget;
