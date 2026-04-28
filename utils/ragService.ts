export interface RAGDocument {
    id: string;
    category: string;
    content: string;
    keywords: string[];
}

const KNOWLEDGE_BASE: RAGDocument[] = [
    {
        id: 'eligibility',
        category: 'Eligibility & Registration',
        content: `Bidders (Recyclers): Must be 18+ or a registered entity. Mandatory SPCB/CPCB licenses for E-waste/Hazardous waste. GST is required. High-value auctions require an Earnest Money Deposit (EMD).
        Sellers (Generators): Must legally own the waste ("Ownership Declaration") and provide a full "Waste Profile" (grade, weight, contamination).
        Verification: All licenses and GST are verified. Misrepresentation leads to immediate suspension.`,
        keywords: ['eligibility', 'eligible', 'register', 'gst', 'pan', 'pcb', 'kyc', 'documents', 'license', 'certificate', 'join', 'signup', 'requirements', 'profile', 'seller', 'bidder', 'age', '18']
    },
    {
        id: 'terms_conditions',
        category: 'Terms and Conditions',
        content: `"As-Is, Where-Is": Waste is sold in current condition/location with no purity warranty.
        Binding Bids: All bids are legal contracts. Winning obligates purchase.
        24-Hour Rule: Winners must pay full amount (minus EMD) to Escrow within 24 hours.
        Default: Failure to pay/pickup leads to EMD forfeiture and suspension.
        Rejection: EcoBid may cancel auctions for fraud/misrepresentation.`,
        keywords: ['terms', 'conditions', 'rules', 'contract', 'binding', 'warranty', 'as-is', 'where-is', '24-hour', 'forfeiture', 'default', 'rejection', 'cancel']
    },
    {
        id: 'privacy_policy',
        category: 'Privacy Policy',
        content: `Collection: We collect Personal ID (Name/Address), Business ID (GST/Licenses), and Transaction Data.
        Usage: Strictly for verification, processing, and legal reporting. We do not sell data.
        Sharing: Contact info shared with Counterparty for logistics. Data shared with Regulators (CPCB/SPCB) for EPR auditing.
        Retention: Records kept for 7 years as per financial/environmental laws.`,
        keywords: ['privacy', 'policy', 'data', 'collection', 'sharing', 'retention', 'usage', 'security', 'third-party', 'confidential']
    },
    {
        id: 'legal_regulations',
        category: 'Legal Rules & Compliance',
        content: `Plastic Waste Management (PWM) Rules: Mandates tracking and EPR credits.
        E-Waste (Management) Rules 2022: Strict disposal protocols; only authorized recyclers can bid.
        Hazardous Waste Rules 2016: Requires "Manifest" systems for transport.
        IT Act 2000: Governs digital contracts and e-signatures.`,
        keywords: ['legal', 'regulation', 'compliance', 'act', 'rule', 'pwm', 'plastic', 'e-waste', 'hazardous', 'manifest', 'it act', 'law']
    },
    {
        id: 'dispute_resolution',
        category: 'Dispute Resolution',
        content: `Mediation: Independent "Waste Auditors" may verify material quality in disputes.
        Jurisdiction: All legal disputes are subject to courts in Mumbai, Maharashtra.
        Resolution Process: Raise a dispute via the app before Escrow release if waste mismatches description.`,
        keywords: ['dispute', 'resolution', 'court', 'jurisdiction', 'mumbai', 'auditor', 'mediation', 'conflict', 'mismatch']
    },
    {
        id: 'listing_guide',
        category: 'Listing a Waste Asset',
        content: `Documentation: Sellers upload photos, weight estimates (kg/tonnes), and contamination levels (e.g., "Plastic Grade 1, 5% impurity").
        Reserve Price: The minimum price the seller is willing to accept. If no bid reaches this, the item is not sold.
        Bid Increments: The platform sets a minimum "jump" for each new bid (e.g., if the current bid is ₹500 and the increment is ₹50, the next bid must be at least ₹550).`,
        keywords: ['listing', 'list', 'asset', 'documentation', 'photos', 'weight', 'contamination', 'reserve price', 'minimum price', 'increment', 'jump']
    },
    {
        id: 'emd',
        category: 'Financial Terms',
        content: `EMD (Earnest Money Deposit): A refundable deposit (usually 2-5% of the estimated value) is required to enter the bidding room.
        Pre-Bid EMD: Users must deposit a specificity EMD (e.g., ₹50,000) to participate.
        Forfeiture: EMD is forfeited if the winner (H1 Bidder) backs out or fails to pay.`,
        keywords: ['emd', 'earnest', 'deposit', 'money', 'refund', 'percentage', 'participation', 'wallet']
    },
    {
        id: 'payment',
        category: 'Financial Terms',
        content: `Payment Timeline: Successful bidders must deposit the full amount within 7-15 days of the "Sale Order" being issued.
        Payment Terms: 100% of the bid value + GST + TCS (Tax Collected at Source) must be paid before lifting the material.
        Payment Mode: RTGS/NEFT or Online Gateway only. Cash is strictly prohibited.
        Taxes: All bids are exclusive of GST. The Bidder bears all applicable taxes (typically 18% for services/recyclables).`,
        keywords: ['payment', 'pay', 'timeline', 'due', 'gst', 'tax', 'tcs', 'cash', 'mode', 'rtgs', 'neft']
    },
    {
        id: 'logistics',
        category: 'Operational Terms',
        content: `Lifting Period: The successful Bidder must lift the waste within 7 to 15 days of the Delivery Order (DO).
        Ground Rent Penalty: If waste is not lifted on time, a penalty (e.g., 1% of bid value per day) applies for storage costs.
        Transport Compliance: Vehicles must be covered (tarpaulin) to prevent spillage, GPS-enabled for tracking, and drivers must carry a "Manifest Form".`,
        keywords: ['lifting', 'lift', 'period', 'transport', 'vehicle', 'truck', 'penalty', 'storage', 'rent', 'gps', 'manifest']
    },
    {
        id: 'quality',
        category: 'Operational Terms',
        content: `"As Is, Where Is" Rule: Bidders buy waste in its current condition; no complaints about quality are accepted after the bid.
        Segregation is Absolute: Mixed waste is strictly penalized. Bids usually apply to specific categories.
        Safety First: All labor used for lifting waste must have proper PPE (gloves, masks, boots) as per labor laws.`,
        keywords: ['quality', 'condition', 'as is', 'complaint', 'segregation', 'mixed', 'safety', 'ppe', 'labor', 'gear']
    },

    {
        id: 'auction_types',
        category: 'Types of Auctions',
        content: `English Auction (Open Bidding): The most common. Price starts low and goes up. Everyone sees the current highest bid.
        Sealed-Bid Auction: Bidders submit one "blind" price. The highest offer wins once the window closes. Good for high-value industrial contracts.
        Reverse Auction: Used when a seller wants a service (like waste collection). Bidders compete by offering the lowest price to do the job.`,
        keywords: ['auction type', 'english auction', 'open bidding', 'sealed-bid', 'blind price', 'reverse auction', 'lowest price']
    },
    {
        id: 'real_time_mechanics',
        category: 'Real-Time Mechanics',
        content: `Auto-Extension (The "Anti-Sniping" Rule): If a bid is placed in the final 2 minutes, the auction clock resets to 5 minutes. This prevents users from stealing a win at the last millisecond.
        Proxy Bidding (Auto-Bid): A bidder sets their "Maximum Price." The system automatically outbids others by the smallest increment until that limit is reached.`,
        keywords: ['remote', 'real-time', 'mechanics', 'anti-sniping', 'auto-extension', 'reset', 'proxy bidding', 'auto-bid', 'maximum price']
    },
    {
        id: 'app_guide',
        category: 'Application Guide',
        content: `Dashboard: Your central hub. View 'Active Bids', 'Pending Actions', and 'Analytics' here.
        My Listings: If you are a seller (Generator), manage your waste listings, edit details, and view bidder history here.
        Profile: Update your KYC documents, password, and contact details in the 'Profile' section.
        Wallet: Check your EMD balance and transaction history. Top up here to participate in more auctions.`,
        keywords: ['dashboard', 'guide', 'navigating', 'navigate', 'profile', 'listings', 'my listings', 'wallet', 'balance', 'account', 'password', 'manage']
    },
    {
        id: 'platform_overview',
        category: 'Platform Overview',
        content: `EcoBid is an advanced e-waste management platform designed to formalize the recycling sector.
        Mission: To bridge the gap between waste generators (businesses/homes) and authorized recyclers via a transparent, tech-driven marketplace.
        Key Features: Live Auctions for bulk waste, Direct Marketplace for smaller lots, AI-powered quality analysis, and end-to-end traceability.
        Target Users: Generators (produce waste), Recyclers (process waste), and Transporters (move waste).`,
        keywords: ['overview', 'about', 'what is', 'ecobid', 'platform', 'mission', 'features', 'generator', 'recycler', 'transporter']
    },
    {
        id: 'marketplace',
        category: 'Marketplace',
        content: `Direct Buy: Unlike auctions, the 'Marketplace' (Material Exchange) allows you to buy waste materials immediately at listed prices.
        Cart System: Add multiple items (e.g., Copper wire, PCB boards) to your cart and checkout in one go.
        Listings: Generators may list specific verified lots of e-waste with photos and expected pricing.
        Smart Pricing: Costs are often benchmarked against current market rates using our AI Price Prophet.`,
        keywords: ['marketplace', 'buy now', 'direct', 'shopping', 'cart', 'exchange', 'material', 'store', 'shop']
    },
    {
        id: 'ai_labs',
        category: 'AI Labs',
        content: `Visual Analysis: Upload a photo of your waste, and our AI identifies the material type (e.g., Motherboard, Plastic) and estimates purity/quality.
        Price Prophet: Get 7-day market price forecasts for commodities like Copper, Aluminium, and Gold to decide the best time to sell or bid.
        Beta Status: These features are experimental and powered by advanced neural networks to help you make data-driven decisions.`,
        keywords: ['ai', 'labs', 'artificial intelligence', 'predict', 'forecast', 'scan', 'photo', 'analyze', 'price', 'future']
    },
    {
        id: 'finalization_logistics',
        category: 'Finalization & Logistics',
        content: `Winning: Once the timer hits zero, the highest bidder is declared the winner.
        Escrow System: The winner's EMD is locked, and they must pay the full amount into an Escrow Account. The seller only receives the money after the buyer confirms the waste material matches the description.
        Default Penalty: If a winner fails to pay within 24–48 hours, their security deposit is forfeited and the item is offered to the second-highest bidder.
        Collection & "Eco-Manifest": Buyers usually have 3–7 days to collect the material. Both parties must sign a digital "Collection Receipt" via the app.
        Eco-Tracking: For advanced sustainability reporting, the platform generates a "Certificate of Recycling," proving the waste was handled by a verified entity.`,
        keywords: ['winning', 'escrow', 'payment protection', 'default', 'penalty', 'forfeit', 'collection', 'manifest', 'receipt', 'eco-tracking', 'certificate']
    },
    {
        id: 'pro_tips',
        category: 'Pro-Tips for EcoBid Users',
        content: `Watchlists: Users can "Heart" a listing to get push notifications when it’s about to end or when they are outbid.
        Bid History: Users can view the "Tape" (history of all bids) to see the market demand for specific waste types.
        Dispute Resolution: If the waste is lower quality than described, the buyer can "Raise a Dispute" before the Escrow funds are released.`,
        keywords: ['tips', 'pro-tips', 'watchlist', 'heart', 'notification', 'history', 'tape', 'admin', 'dispute', 'resolution', 'quality']
    },
    {
        id: 'pricing_metals',
        category: 'Market Rates - Metals',
        content: `Copper (Armature/Cable): ₹710 - ₹1,250/kg. Key Factor: Purity & LME benchmarks.
        Aluminium (Utensils/Wire): ₹150 - ₹320/kg. Key Factor: Highest demand for wire-grade.
        Brass (Honey/Sheet): ₹520 - ₹820/kg. Key Factor: Zinc content affects value.
        Iron (MS Scrap/HMS): ₹22 - ₹45/kg. Key Factor: Melting quality (HMS 1 vs 2).
        Stainless Steel (304): ₹80 - ₹110/kg. Key Factor: Grade 304 is premium vs 202.`,
        keywords: ['price', 'rate', 'cost', 'metal', 'copper', 'aluminium', 'brass', 'iron', 'steel', 'scrap price', 'market rate']
    },
    {
        id: 'pricing_plastics',
        category: 'Market Rates - Plastics',
        content: `PET Bottles (Clear/Hot Washed): ₹35 - ₹55/kg. Key Factor: Hot washed is premium.
        HDPE (Milk/Shampoo Bottles): ₹40 - ₹75/kg. Key Factor: Higher price for natural/white color.
        Mixed Plastic Scrap: ₹12 - ₹35/kg. Key Factor: Prices linked to crude oil fluctuations.`,
        keywords: ['price', 'rate', 'cost', 'plastic', 'pet', 'hdpe', 'bottle', 'mixed plastic', 'scrap price']
    },
    {
        id: 'pricing_paper',
        category: 'Market Rates - Paper',
        content: `Old Newspaper (ONP): ₹14 - ₹25/kg. Key Factor: Over-issued (unprinted) fetches ₹25.
        Cardboard (OCC): ₹8 - ₹15/kg. Key Factor: Moisture content must be < 5%.
        Office Paper (A4/White): ₹14 - ₹32/kg. Key Factor: White Ledger/SOP is highest grade.`,
        keywords: ['price', 'rate', 'cost', 'paper', 'newspaper', 'cardboard', 'office paper', 'waste paper', 'recycle rate']
    },
    {
        id: 'pricing_ewaste',
        category: 'Market Rates - E-Waste',
        content: `Laptop (Per Piece): ₹300 - ₹1,500/pc. Key Factor: Component reuse value.
        PC Processor/CPU: ₹225/pc - ₹3,000/kg. Key Factor: High precious metal recovery value.
        AC (1.5 Ton Copper Coil): ₹3,200 - ₹5,500/unit. Key Factor: Coil condition (Copper vs. Aluminium).`,
        keywords: ['price', 'rate', 'cost', 'ewaste', 'e-waste', 'laptop', 'cpu', 'processor', 'ac', 'air conditioner', 'scrap value']
    }
];

export const RAGService = {
    generateResponse: (query: string): { response: string; source?: string } => {
        // 1. Pre-processing: Normalize input
        const normalizedQuery = query.toLowerCase().replace(/[?.,!]/g, '');
        const queryTokens = normalizedQuery.split(' ').filter(t => t.length > 2); // Ignore short words

        // 2. Retrieval: Advanced Scoring
        const scoredDocs = KNOWLEDGE_BASE.map(doc => {
            let score = 0;
            let matchCount = 0;

            // Keyword Match (+3)
            doc.keywords.forEach(keyword => {
                if (normalizedQuery.includes(keyword)) {
                    score += 3;
                    matchCount++;
                }
            });

            // Content Match (+1) - New Broad Search
            if (doc.content.toLowerCase().includes(normalizedQuery) || queryTokens.some(t => doc.content.toLowerCase().includes(t))) {
                score += 1;
                matchCount++;
            }

            // Contextual Boost: If query contains words like "how", "what", "where" + category terms
            if (normalizedQuery.includes('how') || normalizedQuery.includes('what') || normalizedQuery.includes('when')) {
                if (matchCount > 0) score += 1; // Boost questions about known topics
            }

            // Category Boost
            if (normalizedQuery.includes(doc.category.toLowerCase())) score += 4;

            return { doc, score };
        }).sort((a, b) => b.score - a.score);

        const bestMatch = scoredDocs[0];

        // 3. Fallback Logic with Partial Match Handling
        if (bestMatch.score > 0) { // Respond if ANY relevance is found
            return {
                response: formatResponse(bestMatch.doc),
                source: bestMatch.doc.category
            };
        }

        // 4. "Did you mean?" Fallback -> REMOVED hedging, default to Platform Overview if absolutely 0
        // Find "Platform Overview" or "Application Guide" as a safe fallback
        const defaultDoc = KNOWLEDGE_BASE.find(d => d.id === 'platform_overview') || KNOWLEDGE_BASE[0];

        return {
            response: `Here is some general information about EcoBid that might help:\n\n${formatResponse(defaultDoc)}`,
            source: "Platform Overview"
        };
    }
};

function formatResponse(doc: RAGDocument): string {
    // Apply "Eco-friendly tone" and "Professionalism"
    const contentLines = doc.content.split('\n').map(line => line.trim()).filter(l => l);

    // Convert content to bullet points if multiple lines
    let formattedContent = "";
    if (contentLines.length > 1) {
        formattedContent = contentLines.map(line => `• ${line}`).join('\n');
    } else {
        formattedContent = doc.content;
    }

    return `According to our **${doc.category}** terms:\n\n${formattedContent}\n\nPlease ensure you follow these guidelines for a sustainable trading experience.`;
}
