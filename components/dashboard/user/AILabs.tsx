import React, { useState } from 'react';
import { Camera, Upload, Scan, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { AILabsService } from '../../../utils/aiLabsService';

const AILabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'scan' | 'price'>('scan');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-transparent bg-clip-text">Future AI Labs</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold uppercase border border-purple-200">Beta</span>
                    </h1>
                    <p className="text-gray-500 mt-1">Experimental features powered by Advanced Neural Networks.</p>
                </div>

                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'scan' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Visual Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('price')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'price' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Price Prophet
                    </button>
                </div>
            </div>

            {activeTab === 'scan' ? <VisualAnalyzer /> : <PricePredictor />}

        </div>
    );
};

const VisualAnalyzer = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFile = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (ev) => setImage(ev.target?.result as string);
        reader.readAsDataURL(file);

        // Process
        setIsScanning(true);
        setResult(null);

        try {
            const data = await AILabsService.analyzeImage(file);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Camera size={20} className="text-purple-500" /> Upload Sample
                </h3>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50/50 hover:bg-white transition-colors">
                    {image ? (
                        <>
                            <img src={image} alt="Preview" className="max-h-64 object-contain rounded-lg shadow-md z-10" />
                            {isScanning && (
                                <div className="absolute inset-0 bg-black/50 z-20 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                    <Scan size={48} className="animate-pulse mb-3" />
                                    <p className="font-mono text-sm tracking-widest animate-pulse">ANALYZING TEXTURE...</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-12">
                            <Upload size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Click to upload photo of waste</p>
                            <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    )}
                    <input title="Upload Waste Image" type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
            </div>

            {/* Results Area */}
            <div className="space-y-4">
                <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full transition-all duration-500 ${isScanning ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <BarChart3 size={48} className="mb-4 opacity-20" />
                            <p>Upload an image to see AI analysis</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Detected Material</p>
                                    <h2 className="text-3xl font-bold text-gray-800 mt-1">{result.material}</h2>
                                </div>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> {Math.round(result.confidence * 100)}% Match
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <p className="text-xs text-purple-600 font-bold mb-1">Quality Grade</p>
                                    <p className="text-lg font-semibold text-gray-800">{result.purity}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold mb-1">Est. Weight</p>
                                    <p className="text-lg font-semibold text-gray-800">{result.estimatedWeight}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Impurities Detected:</p>
                                <div className="flex gap-2">
                                    {result.impurities.map((imp: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100 flex items-center gap-1">
                                            <AlertTriangle size={12} /> {imp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PricePredictor = () => {
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);

    const handlePredict = async (cat: string) => {
        setLoading(true);
        setPrediction(null);
        try {
            const data = await AILabsService.getPriceForecast(cat);
            setPrediction(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <History size={20} className="text-indigo-500" /> Select Commodity
                    </h3>
                    <div className="space-y-2">
                        {['Plastic (PET)', 'Copper Wire', 'Aluminum Cans', 'Cardboard (OCC)'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => handlePredict(cat)}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex justify-between items-center group"
                            >
                                <span className="font-medium text-gray-700">{cat}</span>
                                <TrendingUp size={16} className="text-gray-300 group-hover:text-indigo-500" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full min-h-[300px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-indigo-400">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-medium animate-pulse">Crunching Global Market Data...</p>
                        </div>
                    ) : prediction ? (
                        <div className="flex-1 animate-fade-in">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-sm text-gray-500">7-Day Forecast</p>
                                    <h3 className="text-3xl font-bold text-gray-800">
                                        ₹{prediction.currentPrice}<span className="text-sm font-normal text-gray-400">/kg</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 mb-1 ${prediction.trend.includes('Up') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {prediction.trend}
                                    </div>
                                    <p className="text-xs text-indigo-600 font-bold">AI Advice: {prediction.recommendation}</p>
                                </div>
                            </div>

                            <div className="flex items-end gap-2 h-48 mt-auto">
                                {prediction.forecast.map((day: any, i: number) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full bg-indigo-50 rounded-t-lg relative group-hover:bg-indigo-100 transition-all overflow-hidden">
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-indigo-500 opacity-20 group-hover:opacity-30 transition-all"
                                                style={{ height: `${(day.price / (prediction.currentPrice * 1.5)) * 100}%` }}
                                            ></div>
                                            <div className="absolute bottom-2 w-full text-center text-xs font-bold text-indigo-700">₹{day.price}</div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">{day.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <TrendingUp size={48} className="mb-4 opacity-20" />
                            <p>Select a material to generate forecast</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AILabs;
