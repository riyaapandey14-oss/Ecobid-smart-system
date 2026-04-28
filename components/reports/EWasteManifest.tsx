import React from 'react';

interface EWasteManifestProps {
    manifestNo: string;
    date: string;
    senderName: string;
    senderAddress: string;
    senderPhone: string;
    transporterName: string;
    transporterVehicle: string;
    receiverName: string;
    receiverAddress: string;
    itemDescription: string;
    quantity: string;
    weight: string;
    copyColor: string; // 'Yellow' | 'Pink' | 'Green'
    copyName: string; // 'Sender Copy' | 'Receiver Copy' | 'Transporter Copy'
}

const EWasteManifest: React.FC<EWasteManifestProps> = ({
    manifestNo,
    date,
    senderName,
    senderAddress,
    senderPhone,
    transporterName,
    transporterVehicle,
    receiverName,
    receiverAddress,
    itemDescription,
    quantity,
    weight,
    copyColor,
    copyName
}) => {
    // Determine background color class based on copyColor
    let bgClass = "bg-white";
    if (copyColor === 'Yellow') bgClass = "bg-yellow-50";
    if (copyColor === 'Pink') bgClass = "bg-pink-50";
    if (copyColor === 'Green') bgClass = "bg-green-50";

    return (
        <div className={`p-8 max-w-[800px] mx-auto border-2 border-black text-sm font-mono ${bgClass} print:bg-white`}>
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-4 mb-4">
                <h1 className="text-xl font-bold uppercase">Form-6</h1>
                <p className="italic font-bold">[See rule 19]</p>
                <h2 className="text-lg font-bold uppercase mt-2">E-Waste Manifest</h2>
            </div>

            <div className="flex justify-between mb-6">
                <p><strong>Manifest No:</strong> {manifestNo}</p>
                <p><strong>Date:</strong> {date}</p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {/* 1. Sender */}
                <div className="border border-black p-4">
                    <h3 className="font-bold border-b border-black mb-2 pb-1">1. Sender Details (Generator)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-bold">{senderName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Authorization No</p>
                            <p>N/A (Bulk Consumer)</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-gray-500">Address & Phone</p>
                            <p>{senderAddress}, Ph: {senderPhone}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Transporter */}
                <div className="border border-black p-4">
                    <h3 className="font-bold border-b border-black mb-2 pb-1">2. Transporter Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Company Name</p>
                            <p className="font-bold">{transporterName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Vehicle Registration No</p>
                            <p className="font-bold">{transporterVehicle}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Receiver */}
                <div className="border border-black p-4">
                    <h3 className="font-bold border-b border-black mb-2 pb-1">3. Receiver Details (Recycler)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-bold">{receiverName}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-gray-500">Address</p>
                            <p>{receiverAddress}</p>
                        </div>
                    </div>
                </div>

                {/* 4. Waste Description */}
                <div className="border border-black p-4">
                    <h3 className="font-bold border-b border-black mb-2 pb-1">4. Waste Description</h3>
                    <table className="w-full text-left border-collapse border border-black">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-black p-2">Item Description</th>
                                <th className="border border-black p-2">Quantity</th>
                                <th className="border border-black p-2">Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-2">{itemDescription}</td>
                                <td className="border border-black p-2">{quantity}</td>
                                <td className="border border-black p-2">{weight}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-4 text-center pt-8">
                    <div>
                        <div className="border-b border-black h-12"></div>
                        <p className="font-bold mt-1">Sender's Signature</p>
                    </div>
                    <div>
                        <div className="border-b border-black h-12"></div>
                        <p className="font-bold mt-1">Transporter's Signature</p>
                    </div>
                    <div>
                        <div className="border-b border-black h-12"></div>
                        <p className="font-bold mt-1">Receiver's Signature</p>
                    </div>
                </div>
            </div>

            {/* Footer Copy Info */}
            <div className="mt-8 text-center pt-4 border-t-2 border-black">
                <p className="font-bold uppercase tracking-widest text-xs">{copyColor} Copy - {copyName}</p>
            </div>
        </div>
    );
};

export default EWasteManifest;
