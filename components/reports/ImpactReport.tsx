import React from 'react';
import { Trees, Droplets, Zap, Wind, Info } from 'lucide-react';
import { ImpactStats, ReportService } from '../services/ReportService';

interface CarbonReportProps {
    schoolName: string;
    stats: ImpactStats;
    period?: string;
}

const CarbonReport: React.FC<CarbonReportProps> = ({
    schoolName,
    stats,
    period = "Q1 2025" // Default or dynamic
}) => {
    return (
        <div className="bg-white p-8 max-w-[800px] mx-auto border border-gray-200 rounded-xl shadow-lg print:shadow-none print:border-none">
            {/* Header */}
            <div className="border-b border-gray-100 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h6 className="text-eco-green font-bold uppercase tracking-wider text-sm mb-1">Impact Report</h6>
                    <h1 className="text-3xl font-bold text-gray-900">Environmental Impact</h1>
                    <p className="text-gray-500">{schoolName} • {period}</p>
                </div>
                <div className="text-right">
                    <div className="bg-eco-green/10 text-eco-green px-4 py-2 rounded-lg font-bold">
                        Scope 3 Reduction
                    </div>
                </div>
            </div>

            {/* Hero Visualization */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-8 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white text-eco-green rounded-full shadow-md mb-4">
                    <Trees size={48} />
                </div>
                <h2 className="text-5xl font-bold text-gray-900 mb-2">{stats.treesSaved}</h2>
                <p className="text-xl text-green-800 font-medium">Trees Saved</p>
                <p className="text-sm text-green-600 mt-2">By recycling waste instead of landfilling, you've saved a small forest!</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.waterSaved > 0 && (
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <Droplets className="text-blue-500 mb-4" size={32} />
                        <p className="text-3xl font-bold text-gray-900">{stats.waterSaved.toLocaleString()}</p>
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Liters of Water Saved</p>
                        <p className="text-xs text-blue-600/80 mt-1">Enough for {(stats.waterSaved / 300).toFixed(0)} homes/day!</p>
                    </div>
                )}

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <Wind className="text-gray-500 mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-900">{stats.co2Avoided.toLocaleString()} <span className="text-base font-normal text-gray-500">kg</span></p>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">CO2 Avoided</p>
                    <p className="text-xs text-gray-500 mt-1">Direct contribution to Net Zero.</p>
                </div>

                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                    <Zap className="text-yellow-600 mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-900">{stats.energySaved.toLocaleString()} <span className="text-base font-normal text-gray-500">kWh</span></p>
                    <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Energy Saved</p>
                    <p className="text-xs text-yellow-600/80 mt-1">Powering a school for {(stats.energySaved / 50).toFixed(0)} hours.</p>
                </div>
            </div>

            {/* Auditor Note */}
            <div className="bg-gray-900 text-white p-6 rounded-xl flex gap-4 items-start">
                <Info className="flex-shrink-0 mt-1 text-blue-400" />
                <div>
                    <h4 className="font-bold mb-1">Auditor Note</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        "This reduction contributes to Scope 3 Emissions reduction under the Green Audit Framework.
                        Data verified by EcoBid Sustainability Protocol."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CarbonReport;
