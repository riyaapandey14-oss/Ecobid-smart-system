import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';

// Simulated Risk Service
const RiskService = {
    getRiskAlerts: () => {
        return [
            { id: 1, auctionId: '#4921', riskLevel: 'High', reason: 'Collusion detected: Bidder A & B same IP', status: 'Pending' },
            { id: 2, auctionId: '#4925', riskLevel: 'Medium', reason: 'Unusual rapid withdrawals', status: 'Pending' },
        ];
    }
};

const RiskMonitorWidget: React.FC = () => {
    const [alerts, setAlerts] = useState<any[]>([]);

    useEffect(() => {
        setAlerts(RiskService.getRiskAlerts());
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-red-600" size={20} />
                    <h3 className="font-bold text-red-800">Anti-Collusion Guard</h3>
                </div>
                <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{alerts.length} Risks</span>
            </div>

            <div className="divide-y divide-gray-100">
                {alerts.map(alert => (
                    <div key={alert.id} className="p-4 hover:bg-gray-50 flex items-start gap-3">
                        <div className="mt-1">
                            <AlertTriangle size={16} className="text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <span className="font-bold text-sm text-gray-800">{alert.auctionId}</span>
                                <span className="text-[10px] font-bold text-red-600 uppercase border border-red-200 px-1 rounded bg-red-50">{alert.riskLevel}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{alert.reason}</p>
                        </div>
                        <button className="text-xs text-blue-600 font-bold hover:underline">
                            Investigate
                        </button>
                    </div>
                ))}
                {alerts.length === 0 && (
                    <div className="p-6 text-center text-gray-400 text-sm">
                        <CheckCircle2 size={24} className="mx-auto mb-2 text-green-400" />
                        <p>System Safe. No collusion detected.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskMonitorWidget;
