import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const VoiceAssistant: React.FC = () => {
    const [listening, setListening] = useState(false);
    const [processing, setProcessing] = useState(false);

    const toggleListen = () => {
        if (listening) {
            setListening(false);
            return;
        }

        setListening(true);
        // Simulate listening duration
        setTimeout(() => {
            setListening(false);
            setProcessing(true);

            // Simulate processing
            setTimeout(() => {
                setProcessing(false);
                // In a real app, this would trigger a filter or search action
                alert("Voice Command Recognized: 'Filter for Plastic'");
            }, 1000);
        }, 3000);
    };

    return (
        <button
            onClick={toggleListen}
            className={`fixed bottom-24 right-6 z-40 p-3 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${listening ? 'bg-red-500 scale-110 shadow-red-500/40' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'}`}
        >
            {processing ? (
                <Loader2 className="text-white animate-spin" size={24} />
            ) : listening ? (
                <div className="relative">
                    <span className="absolute -inset-4 rounded-full border border-white/30 animate-ping"></span>
                    <Mic className="text-white relative z-10" size={24} />
                </div>
            ) : (
                <Mic className="text-white" size={24} />
            )}

            {listening && (
                <div className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                    Listening...
                </div>
            )}
        </button>
    );
};

export default VoiceAssistant;
