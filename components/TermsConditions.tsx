import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';

interface TermsConditionsProps {
  onBack: () => void;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4 flex items-center shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="ml-2 font-semibold text-lg text-gray-800">Back to Registration</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in-up">
        <div className="max-w-3xl mx-auto pb-12">
          
          <div className="flex flex-col items-center mb-10">
            <div className="scale-75 mb-2">
                <Logo variant="dark" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 text-center">Terms & Conditions</h1>
            <p className="text-gray-500 mt-2">Last Updated: October 2023</p>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            {/* Key Highlights */}
            <section className="bg-eco-bgLight p-6 rounded-2xl border border-eco-green/20">
              <h3 className="text-xl font-bold text-eco-darkGreen mb-4">Key Operational Rules</h3>
              <ul className="space-y-3 list-disc pl-5">
                <li>
                  <strong className="text-gray-900">Eligibility is Mandatory:</strong> Users must hold valid GST, PAN, and Pollution Control Board (PCB) Authorization (for hazardous/e-waste) to bid.
                </li>
                <li>
                  <strong className="text-gray-900">"As Is, Where Is" Rule:</strong> Bidders buy waste in its current condition; no complaints about quality are accepted after the bid.
                </li>
                <li>
                  <strong className="text-gray-900">EMD (Earnest Money Deposit):</strong> A refundable deposit (usually 2-5% of the estimated value) is required to enter the bidding room.
                </li>
                <li>
                  <strong className="text-gray-900">Segregation is Absolute:</strong> Mixed waste is strictly penalized. Bids usually apply to specific categories (e.g., "Segregated PET Bottles" or "Wet Organic Waste").
                </li>
                <li>
                  <strong className="text-gray-900">Digital Traceability:</strong> Payment is often linked to GPS tracking of the transport vehicle and Weight Bridge receipts.
                </li>
                <li>
                  <strong className="text-gray-900">No Cartels:</strong> Evidence of bid-rigging or collusion leads to immediate blacklisting and forfeiture of deposits.
                </li>
                <li>
                  <strong className="text-gray-900">Payment Timeline:</strong> Successful bidders must deposit the full amount within 7-15 days of the "Sale Order" being issued.
                </li>
                <li>
                  <strong className="text-gray-900">Safety First:</strong> All labor used for lifting waste must have proper PPE (gloves, masks, boots) as per labor laws.
                </li>
              </ul>
            </section>

            {/* 1. Definitions & Scope */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Definitions & Scope</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-900">The Platform:</strong> Refers to the "Online Waste Bidding System" (e.g., EcoBid).</li>
                <li><strong className="text-gray-900">The Service:</strong> The e-auctioning of recyclable, dry, wet, or hazardous waste.</li>
                <li><strong className="text-gray-900">The Generator (Seller):</strong> The entity selling the waste (e.g., Municipal Corporation, Housing Society).</li>
                <li><strong className="text-gray-900">The Bidder (Buyer):</strong> The recycling company or aggregator participating in the auction.</li>
                <li><strong className="text-gray-900">SWM Rules:</strong> Refers to the Solid Waste Management Rules, 2016 and E-Waste Management Rules, 2022.</li>
              </ul>
            </section>

            {/* 2. User Eligibility & Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. User Eligibility & Registration</h2>
              <div className="space-y-3">
                <p><strong className="text-gray-900">KYC Compliance:</strong> Bidders must upload valid copies of:</p>
                <ul className="list-disc pl-8 mb-2">
                    <li>GST Registration Certificate.</li>
                    <li>PAN Card.</li>
                    <li>Valid Mobile No. & Email (verified via OTP).</li>
                </ul>
                
                <p><strong className="text-gray-900">Statutory Authorization:</strong></p>
                <ul className="list-disc pl-8 mb-2">
                    <li>For General Waste: Shop & Establishment Act License.</li>
                    <li>For E-Waste/Battery/Hazardous: Valid Passbook/Authorization issued by the State Pollution Control Board (SPCB) or CPCB as a "Registered Recycler" or "Dismantler."</li>
                </ul>

                <p><strong className="text-gray-900">Barring of Defaulters:</strong> Any user previously blacklisted by a government body or the Platform for non-payment or breach of contract is permanently barred.</p>
              </div>
            </section>

            {/* 3. The Bidding Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. The Bidding Process (Rules of Engagement)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-900">Reserve Price:</strong> The Seller sets a minimum "Base Price." The system will not accept bids below this threshold unless marked as "Subject to Approval" (STA).</li>
                <li><strong className="text-gray-900">Bid Validity:</strong> Bids usually remain valid for 60 to 90 days from the auction closing date.</li>
                <li><strong className="text-gray-900">Dynamic Extension:</strong> If a bid is placed in the last 5 minutes of the auction, the closing time automatically extends by 5-10 minutes to prevent "sniping."</li>
                <li>
                    <strong className="text-gray-900">Earnest Money Deposit (EMD):</strong>
                    <ul className="list-[circle] pl-6 mt-1">
                        <li>Pre-Bid EMD: Users must deposit a "Wallet Balance" or specific EMD (e.g., ₹50,000) to participate.</li>
                        <li>Forfeiture: EMD is forfeited if the winner (H1 Bidder) backs out or fails to pay.</li>
                    </ul>
                </li>
              </ul>
            </section>

            {/* 4. Operational & Logistics Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Operational & Logistics Terms</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-900">"As Is, Where Is" Basis:</strong> The Seller makes no warranty regarding the chemical composition, quality, or exact weight of the waste. Inspection prior to bidding is the Bidder's responsibility.</li>
                <li>
                    <strong className="text-gray-900">Lifting Period:</strong>
                    <ul className="list-[circle] pl-6 mt-1">
                        <li>The successful Bidder must lift the waste within 7 to 15 days of the Delivery Order (DO).</li>
                        <li>Ground Rent Penalty: If waste is not lifted on time, a penalty (e.g., 1% of bid value per day) applies for storage costs.</li>
                    </ul>
                </li>
                <li>
                    <strong className="text-gray-900">Transport Compliance:</strong>
                    <ul className="list-[circle] pl-6 mt-1">
                        <li>Vehicles must be covered (tarpaulin) to prevent spillage.</li>
                        <li>Vehicles must be GPS-enabled and registered on the Platform for tracking.</li>
                        <li>Drivers must carry a "Manifest Form" (Form 10 for hazardous waste) during transport.</li>
                    </ul>
                </li>
              </ul>
            </section>

            {/* 5. Financial Terms & Penalties */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Financial Terms & Penalties</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong className="text-gray-900">Payment Terms:</strong>
                    <ul className="list-[circle] pl-6 mt-1">
                        <li>Full Payment: 100% of the bid value + GST + TCS (Tax Collected at Source) must be paid before lifting the material.</li>
                        <li>Payment Mode: RTGS/NEFT or Online Gateway only. Cash is strictly prohibited.</li>
                    </ul>
                </li>
                <li><strong className="text-gray-900">Taxes:</strong> All bids are exclusive of GST. The Bidder bears all applicable taxes (typically 18% for services/recyclables).</li>
                <li>
                    <strong className="text-gray-900">Penalties for Breach:</strong>
                    <ul className="list-[circle] pl-6 mt-1">
                        <li>Non-Payment: Cancellation of the winning bid and blacklisting for 1 year.</li>
                        <li>Unsafe Practices: ₹5,000 to ₹50,000 fine per incident for labor working without safety gear.</li>
                    </ul>
                </li>
              </ul>
            </section>

            {/* 6. Legal & Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Legal & Dispute Resolution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-gray-900">Indemnity:</strong> The Bidder indemnifies the Platform and Seller against any accidents, injuries, or environmental damage caused during the lifting/transport of waste.</li>
                <li><strong className="text-gray-900">Force Majeure:</strong> Neither party is liable for delays caused by "Acts of God" (floods, earthquakes, pandemics), provided notice is given within 24 hours.</li>
                <li><strong className="text-gray-900">Jurisdiction:</strong> Any legal disputes arising from the use of the Platform shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;